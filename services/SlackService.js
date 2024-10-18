const { App } = require("@slack/bolt");

const AxiosService = require("./AxiosService");
const QuotesService = require("./QuotesService");

class SlackService {
  constructor() {
    if (SlackService.instance) {
      return SlackService.instance;
    }

    this.quotesService = QuotesService;
    this.axiosService = AxiosService;
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL_GENERAL;

    this.slackApp = new App({
      token: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      appToken: process.env.SLACK_APP_TOKEN,
      socketMode: true,
    });

    SlackService.instance = this;

    return this;
  }

  async chargeCommands() {
    this.slackApp.command("/hi-promatron", async ({ command, ack, say }) => {
      await ack();
      await say(`
        👋 ¡Hola, ${command.user_name}! ¿En qué te puedo ayudar hoy?
        
        Aquí tienes algunas opciones [v1]:
        • \`/hi-promatron\`: Saluda a Promatron.
        • \`/say-my-name\`: Escucha tu nombre [nombre].
        • \`/pending-tasks\`: Ver las tareas pendientes de jira (En desarrollo).
        • \`/great-day\`: ¡Recibe un mensaje para alegrar tu día! 😊
        • \`/want-colaborate\`: ¿Quieres colaborar con Promatron?
        `);
    });

    this.slackApp.command("/say-my-name", async ({ command, ack, say }) => {
      await ack();
      await say(`Hola tu eres: ${command.text}!`);
    });

    this.slackApp.command("/pending-tasks", async ({ command, ack, say }) => {
      await ack();
      await say(`Tareas pendientes de: ${command.text}!`);
    });

    this.slackApp.command("/great-day", async ({ command, ack, say }) => {
      await ack();

      const quote = await this.quotesService.getMotivationalQuote();

      await say(`
        ✨ *Frase del día* ✨
        "${quote.q}"
        — *${quote.a}*
        `);
    });

    this.slackApp.command("/promatron-help", async ({ command, ack, say }) => {
      await ack();
      await say(`
        👋 ¡Hola, ${command.user_name}!
        
        Aquí tienes algunas opciones [v1]:
        • \`/hi-promatron\`: Saluda a Promatron.
        • \`/say-my-name\`: Escucha tu nombre [nombre].
        • \`/pending-tasks\`: Ver las tareas pendientes de jira *(En desarrollo)*.
        • \`/great-day\`: ¡Recibe un mensaje para alegrar tu día! 😊
        • \`/want-colaborate\`: ¿Quieres colaborar con Promatron?
        `);
    });

    this.slackApp.command("/want-colaborate", async ({ command, ack, say }) => {
      await ack();

      await say(`
        🤖 *¡Oh, vaya!* Parece que quieres mejorarme, ¿eh? 🛠️
        
        ¡Me encanta cuando alguien quiere ayudarme a ser más genial! 🎉  
        Aquí tienes algunas opciones para colaborar:
        
        1. *Acceso a código fuente:* Hazme más inteligente 🤓
        2. *Sugerencias creativas:* Dale rienda suelta a tus ideas 💡
        3. *Documentación:* ¡Ayúdame a explicarme mejor! 📚
        
        Por favor, contacta al equipo usando este correo: jgregorio@promaticsoft.com y te guiará para que podamos comenzar juntos esta aventura 🚀.
        `);
    });

    // Inicializar el servicio de Slack
    await this.slackApp.start();
    console.log("Slack app is running!");
  }

  async sendMessageToSlack(message) {
    try {
      const data = {
        text: message,
      };

      await this.axiosService.post(this.webhookUrl, data);
      console.log("Mensaje enviado a Slack correctamente");
    } catch (error) {
      console.error("Error al enviar el mensaje a Slack:", error.message);
    }
  }

  async sendMotivationalQuote() {
    const quote = await this.quotesService.getMotivationalQuote();

    const message = `
      ✨ *Frase del día* ✨
      "${quote.q}"
      — *${quote.a}*
    `;

    await this.sendMessageToSlack(message);
  }
}

module.exports = new SlackService();

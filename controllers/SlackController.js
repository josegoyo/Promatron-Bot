const SlackService = require("../services/SlackService");
const cron = require("node-cron");

class SlackController {
  constructor() {
    this.slackService = SlackService;
  }

  async listenCommands() {
    await this.slackService.chargeCommands();
  }

  async scheduleSlackCommands() {
    cron.schedule(
      "0 9 * * *",
      async () => {
        console.log("Ejecutando comando programado de Slack...");
        await SlackService.sendMotivationalQuote();
      },
      {
        timezone: "America/Mazatlan",
      }
    );

    console.log("Comandos de Slack programados con éxito.");
  }
}

module.exports = new SlackController();

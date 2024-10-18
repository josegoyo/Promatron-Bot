const AxiosService = require("./AxiosService");

class QuotesService {
  constructor() {
    if (QuotesService.instance) {
      return QuotesService.instance;
    }

    this.axiosService = AxiosService;

    QuotesService.instance = this;
  }

  async getMotivationalQuote() {
    try {
      const response = await this.axiosService.get(process.env.QUOTES_API_URL);
      const randomIndex = Math.floor(Math.random() * response.length);
      const quote = response[randomIndex];
      return quote;
    } catch (error) {
      console.log("Error al obtener una frase motivacional:", error.message);
    }
  }
}

module.exports = new QuotesService();

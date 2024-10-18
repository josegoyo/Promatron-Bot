const axios = require("axios");

class AxiosService {
  constructor() {
    if (AxiosService.instance) {
      return AxiosService.instance;
    }

    this.client = axios.create({
      baseURL: process.env.BASE_URL || "",
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    AxiosService.instance = this;
    return this;
  }

  async get(url, token = "", config = {}) {
    try {
      const response = await this.client.get(url, {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`GET request failed: ${error.message}`);
    }
  }

  async post(url, data, token = "", config = {}) {
    try {
      const response = await this.client.post(url, data, {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`POST request failed: ${error.message}`);
    }
  }
}

module.exports = new AxiosService();

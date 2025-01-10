// API setup

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default class CatApi {
  constructor() {
    this.apiKey = API_KEY;
    this.baseURL = BASE_URL;
  }
  async getCats() {
    try {
      const response = await axios.get(
        `${this.baseURL}breeds?api_key=${this.apiKey}`
      );
      return response.data;
    } catch (error) {
      console.error("Error is:", error);
    }
  }
}

import axios from 'axios';
import { BASE_URL } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(`${BASE_URL}search?q=${this.query}`);

      this.result = res.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}

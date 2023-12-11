const axios = require('axios').default;
const adapter = require('axios/lib/adapters/http');
import { FactSheet } from './factSheet';

axios.defaults.adapter = adapter;

export class API {
  constructor(url) {
    if (url === undefined || url === '') {
      url = process.env.REACT_APP_API_BASE_URL;
    }
    if (url.endsWith('/')) {
      url = url.substr(0, url.length - 1);
    }
    this.url = url;
  }

  withPath(path) {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return `${this.url}${path}`;
  }

  generateAuthToken() {
    return 'Bearer ' + new Date().toISOString();
  }

  async getAllProducts() {
    return axios
      .get(this.withPath('/products'), {
        headers: {
          Authorization: this.generateAuthToken()
        }
      })
      .then((r) => r.data.map((p) => new FactSheet(p)));
  }

  async getFactSheet(id) {
    const query = `query {factSheet(id: "${id}") { id name displayName description type } }`;

    return axios.post(
      this.withPath('/graphql'),
      {
        query,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((r) => new FactSheet(r.data.data.factSheet));
  }
}

export default new API(
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'
);

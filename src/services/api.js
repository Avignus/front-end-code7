import axios from 'axios';
const instances = {
  instanceUsers: axios.create({
    baseURL: 'http://localhost:3000',
    // headers: { 'Content-type': 'application/json; charset=UTF-8' },
  }),
  debts: axios.create({
    baseURL: `https://provadev.xlab.digital/api/v1/`,
    headers: { 'Content-type': 'application/json; charset=UTF-8' }
  }),
}

export default instances;
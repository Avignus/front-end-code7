import instances from "./api";
const { instanceUsers } = instances;
const functions = {
  getUsers: async () => {
    const users = await instanceUsers.get('/account');
    return users.data;
  },
  putDebts: async (object) => {
    const body = object;
    instanceUsers.put('/account', body).then((res) => {
      console.log(res);
    })
  },
  deletePerson: async (id) => {
    instanceUsers.delete(`/account/${id}`).then((res) => {
      console.log(res);
    })
  },
  addPerson: async (body) => {
    instanceUsers.post('/account', body).then((res) => {
      console.log(res);
    })
  }
}

export default functions;




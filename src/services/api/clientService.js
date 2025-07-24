import clientsData from "@/services/mockData/clients.json";

let clients = [...clientsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const clientService = {
  async getAll() {
    await delay(300);
    return [...clients];
  },

  async getById(id) {
    await delay(200);
    const client = clients.find(c => c.Id === parseInt(id));
    return client ? { ...client } : null;
  },

  async create(clientData) {
    await delay(400);
    const maxId = Math.max(...clients.map(c => c.Id), 0);
    const newClient = {
      Id: maxId + 1,
      ...clientData,
      createdAt: new Date().toISOString()
    };
    clients.push(newClient);
    return { ...newClient };
},

  async update(id, clientData) {
    await delay(350);
    const clientId = parseInt(id);
    const index = clients.findIndex(c => c.Id === clientId);
    if (index !== -1) {
      const updatedClient = { ...clients[index], ...clientData };
      clients[index] = updatedClient;
      return { ...updatedClient };
    }
    throw new Error(`Client with ID ${clientId} not found`);
  },
async delete(id) {
    await delay(300);
    const clientId = parseInt(id);
    const index = clients.findIndex(c => c.Id === clientId);
    if (index !== -1) {
      const deletedClient = clients.splice(index, 1)[0];
      return { ...deletedClient };
    }
    throw new Error(`Client with ID ${clientId} not found`);
}
};
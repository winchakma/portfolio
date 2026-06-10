// In-memory data store mimicking a live production database with active CRUD processing

let dataStore = [];
let nextId = 1;

/**
 * Simulates network/DB latency
 * @param {number} ms 
 * @returns {Promise<void>}
 */
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDb = {
  async getAll() {
    await delay();
    return [...dataStore];
  },
  
  async getById(id) {
    await delay();
    return dataStore.find(item => item.id === id);
  },
  
  async create(payload) {
    await delay(150); // Slightly longer for creation
    const newItem = {
      id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload
    };
    dataStore.push(newItem);
    return newItem;
  },
  
  async update(id, payload) {
    await delay();
    const index = dataStore.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    dataStore[index] = {
      ...dataStore[index],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    return dataStore[index];
  },
  
  async delete(id) {
    await delay();
    const index = dataStore.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    dataStore.splice(index, 1);
    return true;
  }
};

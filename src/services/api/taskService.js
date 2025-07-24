import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async getByProjectId(projectId) {
    await delay(250);
    return tasks.filter(t => t.projectId === parseInt(projectId)).map(t => ({ ...t }));
  },

  async create(taskData) {
    await delay(400);
    const maxId = Math.max(...tasks.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      completed: false
    };
    tasks.push(newTask);
    return { ...newTask };
  },

async update(id, taskData) {
    await delay(350);
    const taskId = parseInt(id);
    const index = tasks.findIndex(t => t.Id === taskId);
    if (index !== -1) {
      const updatedTask = { ...tasks[index], ...taskData };
      tasks[index] = updatedTask;
      return { ...updatedTask };
    }
    throw new Error(`Task with ID ${taskId} not found`);
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      const deletedTask = tasks.splice(index, 1)[0];
      return { ...deletedTask };
    }
    return null;
  }
};
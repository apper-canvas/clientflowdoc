import projectsData from "@/services/mockData/projects.json";
import { notificationService } from "./notificationService";

let projects = [...projectsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  async getAll() {
    await delay(350);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.Id === parseInt(id));
    return project ? { ...project } : null;
  },

  async getByClientId(clientId) {
    await delay(300);
    return projects.filter(p => p.clientId === parseInt(clientId)).map(p => ({ ...p }));
  },

  async create(projectData) {
    await delay(400);
    const maxId = Math.max(...projects.map(p => p.Id), 0);
    const newProject = {
      Id: maxId + 1,
      ...projectData,
      progress: 0,
      status: "Not Started"
    };
    projects.push(newProject);
    return { ...newProject };
  },

async update(id, projectData) {
    await delay(350);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      const oldProject = { ...projects[index] };
      projects[index] = { ...projects[index], ...projectData };
      
      // Create notification if project was just completed
      if (oldProject.status !== "Completed" && projectData.status === "Completed") {
        try {
          await notificationService.createProjectCompletionNotification(
            projects[index].name, 
            projects[index].Id
          );
        } catch (error) {
          console.error("Failed to create completion notification:", error);
        }
      }
      
      return { ...projects[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(250);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      const deletedProject = projects.splice(index, 1)[0];
      return { ...deletedProject };
    }
    return null;
  }
};
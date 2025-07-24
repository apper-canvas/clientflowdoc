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
    const projectId = parseInt(id);
    const index = projects.findIndex(p => p.Id === projectId);
    if (index !== -1) {
      const oldProject = { ...projects[index] };
      const updatedProject = { ...projects[index], ...projectData };
      projects[index] = updatedProject;
      
      // Create notification if project was just completed
      if (oldProject.status !== "Completed" && projectData.status === "Completed") {
        try {
          await notificationService.createProjectCompletionNotification(
            updatedProject.title, 
            updatedProject.Id
          );
        } catch (error) {
          console.error("Failed to create completion notification:", error);
        }
      }
      
      return { ...updatedProject };
    }
    throw new Error(`Project with ID ${projectId} not found`);
  },

async delete(id) {
    await delay(300);
    const projectId = parseInt(id);
    const index = projects.findIndex(p => p.Id === projectId);
    if (index !== -1) {
      const deletedProject = projects.splice(index, 1)[0];
      return { ...deletedProject };
    }
    throw new Error(`Project with ID ${projectId} not found`);
  }
};
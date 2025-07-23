let notifications = [
  {
    Id: 1,
    title: "Project Completed",
    message: "E-commerce Website project has been completed successfully!",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    projectId: 1
  },
  {
    Id: 2,
    title: "Project Completed", 
    message: "Mobile App Development project has been completed successfully!",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    projectId: 2
  },
  {
    Id: 3,
    title: "Project Completed",
    message: "Brand Identity Design project has been completed successfully!",
    type: "success", 
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    projectId: 3
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  async getAll() {
    await delay(200);
    return [...notifications];
  },

  async getUnread() {
    await delay(150);
    return notifications.filter(n => !n.read).map(n => ({ ...n }));
  },

  async markAsRead(id) {
    await delay(100);
    const notification = notifications.find(n => n.Id === parseInt(id));
    if (notification) {
      notification.read = true;
      return { ...notification };
    }
    return null;
  },

  async markAllAsRead() {
    await delay(200);
    notifications.forEach(n => n.read = true);
    return [...notifications];
  },

  async create(notificationData) {
    await delay(150);
    const maxId = Math.max(...notifications.map(n => n.Id), 0);
    const newNotification = {
      Id: maxId + 1,
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifications.unshift(newNotification);
    return { ...newNotification };
  },

  async createProjectCompletionNotification(projectName, projectId) {
    const notificationData = {
      title: "Project Completed",
      message: `${projectName} project has been completed successfully!`,
      type: "success",
      projectId: parseInt(projectId)
    };
    return await this.create(notificationData);
  }
};
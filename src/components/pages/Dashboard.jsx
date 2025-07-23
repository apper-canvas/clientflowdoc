import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { clientService } from "@/services/api/clientService";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    activeProjects: 0,
    pendingTasks: 0,
    totalClients: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [clients, projects, tasks] = await Promise.all([
        clientService.getAll(),
        projectService.getAll(),
        taskService.getAll()
      ]);

      const activeProjects = projects.filter(p => 
        p.status === "In Progress" || p.status === "Review"
      ).length;
      
      const pendingTasks = tasks.filter(t => !t.completed).length;

      setMetrics({
        activeProjects,
        pendingTasks,
        totalClients: clients.length
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <Loading type="metrics" />
        <div className="bg-white rounded-xl card-shadow p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 w-48"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center lg:text-left"
      >
        <h1 className="text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects}
          icon="Briefcase"
          gradient="gradient-primary"
          delay={0.1}
        />
        <MetricCard
          title="Pending Tasks"
          value={metrics.pendingTasks}
          icon="CheckSquare"
          gradient="gradient-secondary"
          delay={0.2}
        />
        <MetricCard
          title="Total Clients"
          value={metrics.totalClients}
          icon="Users"
          gradient="gradient-accent"
          delay={0.3}
        />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl card-shadow p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Quick Overview
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  📊
                </motion.div>
              </div>
              <div>
                <p className="font-medium text-gray-900">Projects in progress</p>
                <p className="text-sm text-gray-600">Keep up the great work!</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">{metrics.activeProjects}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⏰
                </motion.div>
              </div>
              <div>
                <p className="font-medium text-gray-900">Tasks awaiting completion</p>
                <p className="text-sm text-gray-600">Stay focused and tackle them one by one</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-orange-600">{metrics.pendingTasks}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👥
                </motion.div>
              </div>
              <div>
                <p className="font-medium text-gray-900">Happy clients</p>
                <p className="text-sm text-gray-600">Your network is growing strong</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-600">{metrics.totalClients}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
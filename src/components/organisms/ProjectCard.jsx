import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import ProgressBar from "@/components/molecules/ProgressBar";
import { format } from "date-fns";

const ProjectCard = ({ project, client, delay = 0, onUpdate, onDelete }) => {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "CheckCircle";
      case "in progress":
        return "Clock";
      case "review":
        return "Eye";
      case "not started":
        return "Circle";
      default:
        return "Circle";
    }
  };

  const handleStatusToggle = () => {
    if (onUpdate) {
      const newStatus = project.status === "Completed" ? "In Progress" : "Completed";
      onUpdate(project.Id, { status: newStatus });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(project.Id, project.title);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg card-shadow hover:card-shadow-hover transition-all duration-200 p-8 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
          <ApperIcon name={getStatusIcon(project.status)} size={24} className="text-primary-600" />
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
          <div className="flex items-center gap-1">
            <button
              onClick={handleStatusToggle}
              className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title={project.status === "Completed" ? "Mark as In Progress" : "Mark as Completed"}
            >
              <ApperIcon name={project.status === "Completed" ? "RotateCcw" : "CheckCircle"} size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Project"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600">{client?.name || "Unknown Client"}</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{project.progress}%</span>
          </div>
          <ProgressBar progress={project.progress} />
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" size={14} className="mr-2 text-gray-400" />
          <span>Due {format(new Date(project.deadline), "MMM dd, yyyy")}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
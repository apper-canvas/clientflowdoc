import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";

const TaskItem = ({ task, project, onToggleComplete, onEdit, delay = 0 }) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  // Update local state when task prop changes
  React.useEffect(() => {
    setIsCompleted(task.completed);
  }, [task.completed]);

  const handleToggle = () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    onToggleComplete?.(task.Id, newStatus);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-lg card-shadow hover:card-shadow-hover p-4 transition-all duration-200 ${
        isCompleted ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isCompleted
              ? "bg-green-500 border-green-500"
              : "border-gray-300 hover:border-primary-500"
          }`}
        >
          {isCompleted && <ApperIcon name="Check" size={14} className="text-white" />}
        </motion.button>
        
<div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-medium ${
              isCompleted ? "line-through text-gray-500" : "text-gray-900"
            }`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <StatusBadge status={task.priority} />
              {!isCompleted && (
                <button
                  onClick={() => onEdit(task)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit task"
                >
                  <ApperIcon name="Edit2" size={14} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <ApperIcon name="Briefcase" size={12} className="mr-1" />
              <span>{project?.title || "Unknown Project"}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Calendar" size={12} className="mr-1" />
              <span>{format(new Date(task.dueDate), "MMM dd")}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ title, value, icon, gradient = "gradient-primary", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl card-shadow hover:card-shadow-hover transition-all duration-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${gradient} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
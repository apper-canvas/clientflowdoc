import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ClientCard = ({ client, delay = 0 }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'secondary';
      case 'Prospect':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl card-shadow hover:card-shadow-hover transition-all duration-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
          <ApperIcon name="User" size={24} className="text-primary-600" />
        </div>
        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ApperIcon name="MoreVertical" size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {client.name}
          </h3>
          <p className="text-sm text-gray-600">{client.company}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" size={14} className="mr-2 text-gray-400" />
            <span className="truncate">{client.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" size={14} className="mr-2 text-gray-400" />
            <span>{client.phone}</span>
</div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Badge 
            variant={getStatusVariant(client.status)} 
            className="text-xs"
          >
            {client.status}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientCard;
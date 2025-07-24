import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ClientCard = ({ client, delay = 0, onUpdate, onDelete }) => {
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

  const handleStatusToggle = () => {
    if (onUpdate) {
      const newStatus = client.status === "Active" ? "Inactive" : "Active";
      onUpdate(client.Id, { status: newStatus });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(client.Id, client.name);
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
        <div className="flex items-center gap-1">
          <button
            onClick={handleStatusToggle}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title={`Mark as ${client.status === "Active" ? "Inactive" : "Active"}`}
          >
            <ApperIcon name={client.status === "Active" ? "UserX" : "UserCheck"} size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Client"
          >
            <ApperIcon name="Trash2" size={14} />
          </button>
        </div>
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
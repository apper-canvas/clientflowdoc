import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Clients", href: "/clients", icon: "Users" },
    { name: "Projects", href: "/projects", icon: "Briefcase" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" }
  ];

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
<div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-gray-700" />
              </div>
              <h1 className="ml-3 text-xl font-bold font-display text-gray-900">
                ClientFlow
              </h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
<ApperIcon
                      name={item.icon}
                      size={20}
                      className={`mr-3 ${isActive ? "text-primary-700" : "text-gray-400 group-hover:text-gray-600"}`}
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        transition={{ type: "tween", duration: 0.3 }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200"
      >
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between flex-shrink-0 px-6 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={24} className="text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold font-display text-gray-900">
                  ClientFlow
                </h1>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "gradient-primary text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <ApperIcon
                      name={item.icon}
                      size={20}
                      className={`mr-3 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
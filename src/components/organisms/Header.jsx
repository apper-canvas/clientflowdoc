import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import NotificationPanel from "@/components/organisms/NotificationPanel";
import { notificationService } from "@/services/api/notificationService";

const Header = ({ title, onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showNotifications]);

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      setShowNotifications(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const unreadNotifications = await notificationService.getUnread();
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  const handleNotificationUpdate = () => {
    fetchUnreadCount();
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <h1 className="text-2xl font-bold font-display text-gray-900">
            {title}
          </h1>
        </div>
        
<div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNotificationClick}
              className={`p-2 rounded-lg transition-colors ${
                showNotifications 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
              <ApperIcon name="Bell" size={20} />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.div>
              )}
            </motion.button>
            
            <NotificationPanel
              isOpen={showNotifications}
              onClose={handleCloseNotifications}
              onNotificationUpdate={handleNotificationUpdate}
            />
          </div>
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
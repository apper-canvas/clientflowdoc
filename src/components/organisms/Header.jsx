import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import NotificationPanel from "@/components/organisms/NotificationPanel";
import { notificationService } from "@/services/api/notificationService";

const Header = ({ title, onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

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

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
  };

  const handleCloseProfile = () => {
    setShowProfileDropdown(false);
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
                  ? 'text-primary-600 bg-gray-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
              <ApperIcon name="Bell" size={20} />
              {unreadCount > 0 && (
<motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
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
{/* Profile Button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              aria-label="Profile menu"
              aria-expanded={showProfileDropdown}
            >
              <ApperIcon name="User" size={16} className="text-gray-600" />
            </button>
            
            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john.doe@company.com</p>
                </div>
                
                <a
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  onClick={handleCloseProfile}
                >
                  <ApperIcon name="User" size={14} className="mr-2" />
                  View Profile
                </a>
                
                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  onClick={handleCloseProfile}
                >
                  <ApperIcon name="Settings" size={14} className="mr-2" />
                  Settings
                </a>
                
                <div className="border-t border-gray-100 mt-1">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    onClick={() => {
                      handleCloseProfile();
                      // Add logout logic here
                      console.log('Logout clicked');
                    }}
                  >
                    <ApperIcon name="LogOut" size={14} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
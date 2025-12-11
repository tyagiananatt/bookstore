import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiX, FiHome, FiBook, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './SidebarMenu.css';

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX < 50) {
        setIsOpen(true);
      } else if (e.clientX > 400 && isOpen) {
        // Keep open if hovering over menu
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen]);

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/', dataText: 'Home' },
    { icon: FiBook, label: 'Store', path: '/store', dataText: 'Browse Books' },
    { icon: FiBook, label: 'Library', path: '/library', dataText: 'Free Books' },
    { icon: FiShoppingCart, label: 'Cart', path: '/cart', dataText: 'Shopping Cart' },
    { icon: FiUser, label: 'Orders', path: '/orders', dataText: 'My Orders' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="sidebar-menu"
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="sidebar-header">
                <h2>Menu</h2>
                <button
                  className="close-btn"
                  onClick={() => setIsOpen(false)}
                  data-cursor-text="Close"
                >
                  <FiX />
                </button>
              </div>

              <nav className="sidebar-nav">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.path}
                      className={`nav-item ${hoveredItem === index ? 'active' : ''}`}
                      onClick={() => handleNavigate(item.path)}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      data-cursor-text={item.dataText}
                    >
                      <Icon className="nav-icon" />
                      <span>{item.label}</span>
                      <motion.div
                        className="nav-indicator"
                        layoutId="activeIndicator"
                        initial={false}
                        animate={{
                          scale: hoveredItem === index ? 1 : 0,
                        }}
                      />
                    </motion.button>
                  );
                })}
              </nav>

              {user && (
                <div className="sidebar-footer">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="username">{user.username}</p>
                      <p className="user-role">{user.role}</p>
                    </div>
                  </div>
                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                    data-cursor-text="Logout"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Side trigger */}
      <motion.div
        className="sidebar-trigger"
        onHoverStart={() => setIsOpen(true)}
        animate={{ opacity: isOpen ? 0 : 1 }}
      />
    </>
  );
};

export default SidebarMenu;


import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingCart, FiSun, FiMoon, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5C4 18.837 4.263 18.201 4.732 17.732C5.201 17.263 5.837 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20V22H6.5C5.837 22 5.201 21.737 4.732 21.268C4.263 20.799 4 20.163 4 19.5V4.5C4 3.837 4.263 3.201 4.732 2.732C5.201 2.263 5.837 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>PageX</span>
        </Link>
        <nav className="nav">
          {user?.role === 'admin' ? (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                Admin
              </Link>
              <Link to="/admin/books" className={`nav-link ${location.pathname.includes('/admin/books') ? 'active' : ''}`}>
                Books
              </Link>
              <Link to="/admin/orders" className={`nav-link ${location.pathname.includes('/admin/orders') ? 'active' : ''}`}>
                Orders
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/store" className={`nav-link ${location.pathname === '/store' ? 'active' : ''}`}>
                Store
              </Link>
              <Link to="/library" className={`nav-link ${location.pathname === '/library' ? 'active' : ''}`}>
                Library
              </Link>
              <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>
                Orders
              </Link>
            </>
          )}
        </nav>
        <div className="header-actions">
          {user?.role !== 'admin' && (
            <Link to="/cart" className="cart-icon">
              <FiShoppingCart />
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </Link>
          )}
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <div className="user-menu" ref={menuRef}>
            <span className="username">{user?.username}</span>
            <button className="user-toggle" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="true" aria-expanded={menuOpen} aria-label="Open user menu">
              <FiChevronDown />
            </button>
            {menuOpen && (
              <div className={`user-popover ${darkMode ? 'dark' : ''}`} role="menu">
                <button className="popover-item" onClick={handleProfile} role="menuitem">
                  <FiUser /> Profile
                </button>
                <button className="popover-item" onClick={handleLogout} role="menuitem">
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

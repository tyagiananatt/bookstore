import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { bookService, orderService } from '../services/api';
import { FiBook, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksData, ordersData] = await Promise.all([
        bookService.getBooks({ limit: 1 }),
        orderService.getAllOrders(),
      ]);
      setStats({
        totalBooks: booksData.total,
        totalOrders: ordersData.length,
        totalRevenue: ordersData.reduce((sum, order) => sum + order.totalAmount, 0),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card" onClick={() => navigate('/admin/books')}>
            <FiBook className="stat-icon" />
            <div>
              <h3>{stats.totalBooks}</h3>
              <p>Total Books</p>
            </div>
          </div>
          <div className="stat-card" onClick={() => navigate('/admin/orders')}>
            <FiShoppingBag className="stat-icon" />
            <div>
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <FiDollarSign className="stat-icon" />
            <div>
              <h3>${stats.totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="admin-actions">
          <button onClick={() => navigate('/admin/books')} className="action-btn">
            Manage Books
          </button>
          <button onClick={() => navigate('/admin/orders')} className="action-btn">
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


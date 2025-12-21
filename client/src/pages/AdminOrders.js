import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="admin-orders">
      <Header />
      <div className="admin-orders-container">
        <h1>Manage Orders</h1>
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8)}</td>
                    <td>{order.user?.username || 'N/A'}</td>
                    <td>{order.items.length} items</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      {order.shippingAddress ? (
                        <>
                          <div>{order.shippingAddress.fullName}</div>
                          <div>{order.shippingAddress.address}</div>
                          <div>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </div>
                          <div>{order.shippingAddress.country}</div>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => window.open(`/orders/${order._id}`, '_blank')}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;


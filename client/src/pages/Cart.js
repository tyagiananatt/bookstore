import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const isShippingValid = () => {
    return (
      shipping.fullName.trim() &&
      shipping.address.trim() &&
      shipping.city.trim() &&
      shipping.state.trim() &&
      shipping.zipCode.trim() &&
      shipping.country.trim()
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      if (!isShippingValid()) {
        toast.error('Please fill in your shipping address');
        return;
      }
      setSubmitting(true);
      const orderData = {
        items: cart.map(item => ({
          bookId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: { ...shipping },
        paymentMethod: 'Card',
      };

      await orderService.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <div className="empty-cart">
          <FiShoppingBag size={64} />
          <h2>Your cart is empty</h2>
          <p>Add some books to get started</p>
          <button onClick={() => navigate('/store')}>Browse Books</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <motion.div
                key={item._id}
                className="cart-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <img
                  src={item.coverImage || 'https://via.placeholder.com/100'}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <p>by {item.author}</p>
                  <span className="cart-item-price">
                    {item.isFree || item.price == null ? 'Free' : `$${Number(item.price).toFixed(2)}`}
                  </span>
                </div>
                <div className="cart-item-controls">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                    <FiPlus />
                  </button>
                </div>
                <div className="cart-item-total">
                  ${((Number(item.price) || 0) * item.quantity).toFixed(2)}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  <FiTrash2 />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="shipping-form">
              <h3>Shipping Address</h3>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={shipping.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={shipping.zipCode}
                  onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout} disabled={submitting}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


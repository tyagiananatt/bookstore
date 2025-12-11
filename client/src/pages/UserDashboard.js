import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { bookService } from '../services/api';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import { FiBook, FiShoppingCart, FiBookOpen, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [continueReading, setContinueReading] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [trending, setTrending] = useState([]);
  const trendingSliderRef = useRef(null);
  const recommendedSliderRef = useRef(null);
  const [trendingScrollLeft, setTrendingScrollLeft] = useState(0);
  const [recommendedScrollLeft, setRecommendedScrollLeft] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const [trendingData, recommendedData] = await Promise.all([
        bookService.getBooks({ sort: 'popular', limit: 10 }),
        bookService.getBooks({ sort: 'rating', limit: 10 }),
      ]);
      setTrending(trendingData.books);
      setRecommended(recommendedData.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const scrollSlider = (ref, direction) => {
    if (!ref.current) return;
    const scrollAmount = 320; // Width of one card + gap
    const currentScroll = ref.current.scrollLeft;
    const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;
    const newScrollLeft = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(maxScroll, currentScroll + scrollAmount);
    
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    });
  };

  const handleTrendingScroll = () => {
    if (trendingSliderRef.current) {
      setTrendingScrollLeft(trendingSliderRef.current.scrollLeft);
    }
  };

  const handleRecommendedScroll = () => {
    if (recommendedSliderRef.current) {
      setRecommendedScrollLeft(recommendedSliderRef.current.scrollLeft);
    }
  };

  const canScrollLeft = (ref) => {
    if (!ref.current) return false;
    return ref.current.scrollLeft > 0;
  };

  const canScrollRight = (ref) => {
    if (!ref.current) return false;
    return ref.current.scrollLeft < (ref.current.scrollWidth - ref.current.clientWidth - 10);
  };

  return (
    <div className={`user-dashboard ${darkMode ? 'dark' : ''}`}>
      <Header />
      <div className="dashboard-hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Welcome back, {user?.username}!</h1>
          <p>Discover your next favorite book</p>
        </motion.div>
        <div className="hero-image">
          <motion.img
             src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXI5a2oyZTVhOTFqemI3ajNmMmd6ejgxcmN5ZWN5NXJsOHV1ZzlwOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AAaXljLcIX2EH1lyb2/giphy.gif"
           //src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmowMWJkcWd5ano5NXM5ZDRmMDl1ZXg5dnltZmZ3MnBtNDFvN3EzeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AqOoXdyfr2M1GzLtFi/giphy.gif"
            alt="Books"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>

      <div className="dashboard-stats">
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/store')}
        >
          <FiBook className="stat-icon" />
          <div>
            <h3>Browse Books</h3>
            <p>Explore our collection</p>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/library')}
        >
          <FiBookOpen className="stat-icon" />
          <div>
            <h3>Open Library</h3>
            <p>Read free books</p>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/cart')}
        >
          <FiShoppingCart className="stat-icon" />
          <div>
            <h3>Cart</h3>
            <p>{getCartCount()} items</p>
          </div>
        </motion.div>
      </div>

      {trending.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Trending Now</h2>
            <div className="slider-controls">
              <button
                className="slider-btn"
                onClick={() => scrollSlider(trendingSliderRef, 'left')}
                disabled={!canScrollLeft(trendingSliderRef)}
                aria-label="Scroll left"
              >
                <FiChevronLeft />
              </button>
              <button
                className="slider-btn"
                onClick={() => scrollSlider(trendingSliderRef, 'right')}
                disabled={!canScrollRight(trendingSliderRef)}
                aria-label="Scroll right"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
          <div
            className="books-slider"
            ref={trendingSliderRef}
            onScroll={handleTrendingScroll}
          >
            {trending.map((book, index) => (
              <motion.div
                key={book._id}
                className="slider-item"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recommended For You</h2>
            <div className="slider-controls">
              <button
                className="slider-btn"
                onClick={() => scrollSlider(recommendedSliderRef, 'left')}
                disabled={!canScrollLeft(recommendedSliderRef)}
                aria-label="Scroll left"
              >
                <FiChevronLeft />
              </button>
              <button
                className="slider-btn"
                onClick={() => scrollSlider(recommendedSliderRef, 'right')}
                disabled={!canScrollRight(recommendedSliderRef)}
                aria-label="Scroll right"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
          <div
            className="books-slider"
            ref={recommendedSliderRef}
            onScroll={handleRecommendedScroll}
          >
            {recommended.map((book, index) => (
              <motion.div
                key={book._id}
                className="slider-item"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default UserDashboard;


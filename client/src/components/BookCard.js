import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiEye, FiStar, FiBook, FiChevronDown, FiChevronLeft, FiBookmark } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './BookCard.css';

const BookCard = ({ book, onDelete, onEdit, showActions = true }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (book.isFree) {
      toast.info('This book is free! Read it in the library.');
      return;
    }
    addToCart(book);
    toast.success('Added to cart!');
  };

  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/store/${book._id}`);
  };

  return (
    <div 
      className="book-card-mobile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="book-card-actions">
        <FiChevronLeft className="action-icon" onClick={(e) => { e.stopPropagation(); window.history.back(); }} />
        <FiBookmark className="action-icon" />
      </div>

      <div className={`book-cover ${isHovered ? 'open' : ''}`}>
        <div className="book-cover-bg"></div>
        {book.coverImage ? (
          <img className="book-top" src={book.coverImage} alt={book.title} />
        ) : (
          <div className="book-top-placeholder">
            <FiBook size={64} />
          </div>
        )}
        <div className="book-side"></div>
        {book.isFree && (
          <div className="free-badge-cover">FREE</div>
        )}
        {book.rating > 0 && (
          <div className="rating-badge-cover">
            <FiStar fill="#FFD700" color="#FFD700" />
            {book.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className={`preface ${isHovered ? 'open' : ''}`}>
        <div className="preface-content">
          <div className="preface-header">
            <div className="preface-title">{book.title}</div>
            <div className={`preface-icon ${isHovered ? 'open' : ''}`}>
              <FiChevronDown />
            </div>
          </div>
          <div className="preface-author">by {book.author}</div>
          <div className="preface-body">
            {book.description && (
              <p>{book.description.substring(0, 150)}...</p>
            )}
            <div className="preface-meta">
              <span className="preface-genre">{book.genre}</span>
              {book.isFree ? (
                <span className="preface-price free">Free</span>
              ) : (
                <span className="preface-price">${book.price?.toFixed(2) || '0.00'}</span>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="preface-actions">
              {!book.isFree && (
                <button
                  className="action-btn view-btn"
                  onClick={handleView}
                  title="View Details"
                >
                  <FiEye />
                  <span>View</span>
                </button>
              )}
              {!book.isFree && (
                <button
                  className="action-btn cart-btn"
                  onClick={handleAddToCart}
                  title="Add to Cart"
                >
                  <FiShoppingCart />
                  <span>Cart</span>
                </button>
              )}
              {book.isFree && book.pdfUrl && (
                <button
                  className="action-btn read-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/library/read/${book._id}`);
                  }}
                  title="Read Book"
                >
                  <FiBook />
                  <span>Read</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;

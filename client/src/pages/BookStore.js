import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import GenreFilter from '../components/GenreFilter';
import SearchBar from '../components/SearchBar';
import { bookService } from '../services/api';
import { FiFilter, FiSortAsc } from 'react-icons/fi';
import './BookStore.css';

const BookStore = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [selectedGenre, searchQuery, sortBy, currentPage]);

  const fetchGenres = async () => {
    try {
      const data = await bookService.getGenres();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        genre: selectedGenre,
        search: searchQuery,
        isFree: 'false',
        sort: sortBy,
        page: currentPage,
        limit: 12,
      };
      const data = await bookService.getBooks(params);
      // Ensure only paid books appear even if server filtering changes
      setBooks((data.books || []).filter((b) => !b.isFree));
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-store">
      <Header />
      <div className="store-container">
        <motion.div
          className="store-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>PageX</h1>
          <p>Discover and purchase your favorite reads</p>
        </motion.div>

        <div className="store-filters">
          <SearchBar onSearch={setSearchQuery} />
          <div className="filter-controls">
            <GenreFilter
              genres={genres}
              selectedGenre={selectedGenre}
              onGenreChange={(genre) => {
                setSelectedGenre(genre);
                setCurrentPage(1);
              }}
            />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="empty-state">No books found</div>
        ) : (
          <>
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookStore;


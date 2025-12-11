import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import { bookService } from '../services/api';
import { FiBookOpen } from 'react-icons/fi';
import './OpenLibrary.css';

const OpenLibrary = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
    fetchFreeBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [selectedGenre, searchQuery, allBooks]);

  const fetchGenres = async () => {
    try {
      const data = await bookService.getBooks({ isFree: 'true', limit: 1000 });
      const uniqueGenres = [...new Set(data.books.map(book => book.genre))];
      setGenres(uniqueGenres.sort());
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchFreeBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks({ isFree: 'true', limit: 1000 });
      setAllBooks(data.books);
      setBooks(data.books);
    } catch (error) {
      console.error('Error fetching free books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...allBooks];

    // Filter by genre
    if (selectedGenre && selectedGenre !== 'All') {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.description && book.description.toLowerCase().includes(query))
      );
    }

    setBooks(filtered);
  };

  return (
    <div className="open-library">
      <Header />
      <div className="library-container">
        <motion.div
          className="library-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiBookOpen size={64} />
          <h1>Open Library</h1>
          <p>Read thousands of free books online</p>
        </motion.div>

        <div className="library-filters">
          <SearchBar onSearch={setSearchQuery} />
          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
        </div>

        {loading ? (
          <div className="loading">Loading free books...</div>
        ) : books.length === 0 ? (
          <div className="empty-state">No free books available</div>
        ) : (
          <>
            <div className="books-count">
              Found {books.length} free {books.length === 1 ? 'book' : 'books'}
            </div>
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OpenLibrary;


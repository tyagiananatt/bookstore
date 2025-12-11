import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { bookService } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import './AdminBooks.css';

const AdminBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [selectedGenre, searchQuery, allBooks]);

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
      const data = await bookService.getBooks({ limit: 1000 });
      setAllBooks(data.books);
      setBooks(data.books);
    } catch (error) {
      toast.error('Failed to fetch books');
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookService.deleteBook(id);
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  return (
    <div className="admin-books">
      <Header />
      <div className="admin-books-container">
        <div className="admin-books-header">
          <h1>Manage Books</h1>
          <button className="add-btn" onClick={() => navigate('/admin/books/add')}>
            <FiPlus /> Add New Book
          </button>
        </div>

        <div className="admin-filters">
          <SearchBar onSearch={setSearchQuery} />
          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
        </div>

        {loading ? (
          <div className="loading">Loading books...</div>
        ) : (
          <>
            <div className="books-count">
              Showing {books.length} of {allBooks.length} books
            </div>
            <div className="books-table">
            <table>
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Free</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <img
                        src={book.coverImage || 'https://via.placeholder.com/50'}
                        alt={book.title}
                        className="book-thumb"
                      />
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>${book.price.toFixed(2)}</td>
                    <td>{book.stock}</td>
                    <td>{book.isFree ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => navigate(`/admin/books/edit/${book._id}`)}>
                          <FiEdit />
                        </button>
                        <button onClick={() => handleDelete(book._id)} className="delete-btn">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </>
        )}
      </div>
    </div>
  );
};

export default AdminBooks;


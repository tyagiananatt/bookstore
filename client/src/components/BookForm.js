import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/api';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';
import { FiUpload, FiX, FiFile, FiImage } from 'react-icons/fi';
import './BookForm.css';

const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Horror',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Technology',
  'Philosophy',
  'Poetry',
  'Drama',
  'Comedy',
  'Adventure',
  'Young Adult',
  'Children'
];

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    price: '',
    stock: '',
    description: '',
    publishedYear: '',
    coverImage: '',
    pdfUrl: '',
    isFree: false,
  });

  useEffect(() => {
    if (isEditMode) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const book = await bookService.getBookById(id);
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        isbn: book.isbn || '',
        price: book.price || '',
        stock: book.stock || '',
        description: book.description || '',
        publishedYear: book.publishedYear || '',
        coverImage: book.coverImage || '',
        pdfUrl: book.pdfUrl || '',
        isFree: book.isFree || false,
      });
    } catch (err) {
      setError('Failed to load book. Please try again.');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('PDF file size must be less than 50MB');
      return;
    }

    setPdfFile(file);
    setUploadingPDF(true);

    try {
      const result = await bookService.uploadPDF(file);
      setFormData(prev => ({
        ...prev,
        pdfUrl: `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${result.pdfUrl}`
      }));
      toast.success('PDF uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload PDF');
      setPdfFile(null);
    } finally {
      setUploadingPDF(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file size must be less than 10MB');
      return;
    }

    setCoverImageFile(file);
    setUploadingImage(true);

    try {
      const result = await bookService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        coverImage: `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${result.imageUrl}`
      }));
      toast.success('Cover image uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload image');
      setCoverImageFile(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const data = {
        ...formData,
        stock: parseInt(formData.stock),
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
        isFree: formData.isFree || false,
      };

      if (String(formData.price).trim() !== '') {
        const parsedPrice = parseFloat(formData.price);
        data.price = isNaN(parsedPrice) ? undefined : parsedPrice;
      } else {
        data.price = undefined;
      }

      if (isEditMode) {
        await bookService.updateBook(id, data);
        toast.success('Book updated successfully!');
      } else {
        await bookService.createBook(data);
        toast.success('Book added successfully!');
      }

      // Redirect based on user role
      if (user?.role === 'admin') {
        navigate('/admin/books');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save book. Please try again.');
      console.error('Error saving book:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <LoadingSpinner />
      </div>
    );
  }

  const handleCancel = () => {
    if (user?.role === 'admin') {
      navigate('/admin/books');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="form-container">
      <Header />
      <div className="form-card">
        <div className="form-header">
          <h1>{isEditMode ? 'Edit Book' : 'Add New Book'}</h1>
          <button 
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Enter author name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genre">Genre *</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              >
                <option value="">Select a genre</option>
                {GENRES.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN (optional)"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="publishedYear">Published Year</label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear() + 1}
                placeholder="YYYY"
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">Cover Image</label>
              <div className="file-upload-container">
                <label htmlFor="coverImageFile" className="file-upload-label">
                  <FiImage />
                  <span>{coverImageFile ? coverImageFile.name : uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    id="coverImageFile"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingImage}
                  />
                </label>
                {coverImageFile && (
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => {
                      setCoverImageFile(null);
                      setFormData(prev => ({ ...prev, coverImage: '' }));
                    }}
                  >
                    <FiX />
                  </button>
                )}
              </div>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="Or enter image URL"
                className="url-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pdfUrl">PDF File</label>
              <div className="file-upload-container">
                <label htmlFor="pdfFile" className="file-upload-label">
                  <FiFile />
                  <span>{pdfFile ? pdfFile.name : uploadingPDF ? 'Uploading...' : 'Upload PDF'}</span>
                  <input
                    type="file"
                    id="pdfFile"
                    accept="application/pdf"
                    onChange={handlePDFUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingPDF}
                  />
                </label>
                {pdfFile && (
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => {
                      setPdfFile(null);
                      setFormData(prev => ({ ...prev, pdfUrl: '' }));
                    }}
                  >
                    <FiX />
                  </button>
                )}
              </div>
              <input
                type="url"
                id="pdfUrl"
                name="pdfUrl"
                value={formData.pdfUrl}
                onChange={handleChange}
                placeholder="Or enter PDF URL"
                className="url-input"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                />
                <span>Free Book (Available in Open Library)</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter book description (optional)"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || uploadingPDF || uploadingImage}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;

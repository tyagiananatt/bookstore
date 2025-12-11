const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    enum: [
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
    ],
  },
  isbn: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Invalid year'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
  },
  coverImage: {
    type: String,
    default: '',
  },
  pdfUrl: {
    type: String,
    default: '',
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ genre: 1 });

module.exports = mongoose.model('Book', bookSchema);


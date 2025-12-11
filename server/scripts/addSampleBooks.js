const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('../models/Book');

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    price: 0,
    stock: 50,
    isFree: true,
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    publishedYear: 1925,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    pdfUrl: 'https://www.gutenberg.org/files/64317/64317-pdf.pdf',
    rating: 4.5,
    totalRatings: 1200,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    price: 0,
    stock: 45,
    isFree: true,
    description: 'A romantic novel of manners written by Jane Austen, following the character development of Elizabeth Bennet.',
    publishedYear: 1813,
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    pdfUrl: 'https://www.gutenberg.org/files/1342/1342-pdf.pdf',
    rating: 4.7,
    totalRatings: 1500,
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Science Fiction',
    price: 0,
    stock: 60,
    isFree: true,
    description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
    publishedYear: 1949,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    pdfUrl: 'https://www.gutenberg.org/files/20203/20203-pdf.pdf',
    rating: 4.6,
    totalRatings: 2000,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    price: 11.99,
    stock: 40,
    isFree: false,
    description: 'A gripping tale of racial injustice and the loss of innocence in the American South.',
    publishedYear: 1960,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca363da85f?w=400',
    pdfUrl: '',
    rating: 4.8,
    totalRatings: 1800,
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    price: 9.99,
    stock: 35,
    isFree: false,
    description: 'A controversial novel about teenage rebellion and alienation in post-war America.',
    publishedYear: 1951,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
    pdfUrl: '',
    rating: 4.3,
    totalRatings: 900,
  },
  {
    title: 'Moby Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    price: 0,
    stock: 30,
    isFree: true,
    description: 'An epic tale of Captain Ahab\'s obsessive quest for revenge against the white whale.',
    publishedYear: 1851,
    coverImage: 'https://images.unsplash.com/photo-1495446815908-a10a7a7e8b3c?w=400',
    pdfUrl: 'https://www.gutenberg.org/files/2701/2701-pdf.pdf',
    rating: 4.4,
    totalRatings: 1100,
  },
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    genre: 'Non-Fiction',
    price: 0,
    stock: 100,
    isFree: true,
    description: 'An ancient Chinese military treatise dating from the Late Spring and Autumn Period.',
    publishedYear: -500,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    pdfUrl: 'https://www.gutenberg.org/files/132/132-pdf.pdf',
    rating: 4.5,
    totalRatings: 800,
  },
  {
    title: 'Alice\'s Adventures in Wonderland',
    author: 'Lewis Carroll',
    genre: 'Fantasy',
    price: 0,
    stock: 55,
    isFree: true,
    description: 'A whimsical tale of a young girl who falls through a rabbit hole into a fantasy world.',
    publishedYear: 1865,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca363da85f?w=400',
    pdfUrl: 'https://www.gutenberg.org/files/11/11-pdf.pdf',
    rating: 4.6,
    totalRatings: 1300,
  },
  {
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    genre: 'Fiction',
    price: 0,
    stock: 40,
    isFree: true,
    description: 'A historical novel set in London and Paris before and during the French Revolution.',
    publishedYear: 1859,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    pdfUrl: 'https://www.gutenberg.org/files/98/98-pdf.pdf',
    rating: 4.4,
    totalRatings: 1000,
  },
  {
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    genre: 'Mystery',
    price: 0,
    stock: 65,
    isFree: true,
    description: 'A collection of twelve detective stories featuring the brilliant detective Sherlock Holmes.',
    publishedYear: 1892,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    pdfUrl: 'https://www.gutenberg.org/files/1661/1661-pdf.pdf',
    rating: 4.7,
    totalRatings: 1400,
  },
  {
    title: 'Dracula',
    author: 'Bram Stoker',
    genre: 'Horror',
    price: 0,
    stock: 35,
    isFree: true,
    description: 'An epistolary novel about Count Dracula\'s attempt to move from Transylvania to England.',
    publishedYear: 1897,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca363da85f?w=400',
    pdfUrl: 'https://www.gutenberg.org/files/345/345-pdf.pdf',
    rating: 4.5,
    totalRatings: 1100,
  },
];

const addSampleBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore');
    console.log('Connected to MongoDB');

    // Clear existing books (optional - remove if you want to keep existing)
    // await Book.deleteMany({});

    // Add sample books
    for (const bookData of sampleBooks) {
      const existingBook = await Book.findOne({ title: bookData.title, author: bookData.author });
      if (!existingBook) {
        const book = new Book(bookData);
        await book.save();
        console.log(`Added: ${bookData.title}`);
      } else {
        console.log(`Skipped (already exists): ${bookData.title}`);
      }
    }

    console.log('Sample books added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample books:', error);
    process.exit(1);
  }
};

addSampleBooks();


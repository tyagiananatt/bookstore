const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Review = require('../models/Review');
const Book = require('../models/Book');

// Create or update review
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    let review = await Review.findOne({ user: req.user._id, book: bookId });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = new Review({
        user: req.user._id,
        book: bookId,
        rating,
        comment,
      });
      await review.save();
    }

    // Update book rating
    const reviews = await Review.find({ book: bookId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Book.findByIdAndUpdate(bookId, {
      rating: avgRating,
      totalRatings: reviews.length,
    });

    await review.populate('user', 'username avatar');
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews for a book
router.get('/book/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's review for a book
router.get('/book/:bookId/my-review', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      user: req.user._id,
      book: req.params.bookId,
    });
    res.json(review || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


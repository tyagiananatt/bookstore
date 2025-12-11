const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Book = require('../models/Book');

// Get user cart (stored in localStorage on frontend, but we can also store on backend)
router.get('/', auth, async (req, res) => {
  try {
    // For now, cart is managed on frontend
    // In future, you can store cart in database
    res.json({ items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


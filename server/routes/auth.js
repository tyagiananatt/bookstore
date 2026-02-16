const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('📝 Registration attempt:', { username, email });
    
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      console.log('❌ User already exists:', username);
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({ username, email, password });
    await user.save();
    
    console.log('✅ User registered successfully:', username);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt:', username);

    // Check for admin login
    if (username === 'admin' && password === 'admin123') {
      try {
        let admin = await User.findOne({ username: 'admin' });
        if (!admin) {
          console.log('📝 Creating admin user...');
          admin = new User({
            username: 'admin',
            email: 'admin@bookstore.com',
            password: 'admin123',
            role: 'admin',
          });
          await admin.save();
        } else {
          const isMatch = await admin.comparePassword(password);
          if (!isMatch) {
            console.log('❌ Admin password mismatch');
            return res.status(400).json({ error: 'Invalid credentials' });
          }
        }
        const token = jwt.sign({ userId: admin._id }, JWT_SECRET, { expiresIn: '7d' });
        console.log('✅ Admin login successful');
        return res.json({
          token,
          user: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
          },
        });
      } catch (dbErr) {
        console.error('❌ Admin login DB error:', dbErr.message);
        return res.status(500).json({ error: 'Database error. Please try again.' });
      }
    }

    const user = await User.findOne({ $or: [{ email: username }, { username }] });
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', username);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('✅ Login successful:', username);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

module.exports = router;


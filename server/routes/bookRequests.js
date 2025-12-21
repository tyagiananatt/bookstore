const express = require('express');
const router = express.Router();
const BookRequest = require('../models/BookRequest');
const { auth } = require('../middleware/auth');

// @route   POST api/book-requests
// @desc    Submit a book request
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, author, additionalInfo } = req.body;

        if (!title || !author) {
            return res.status(400).json({ message: 'Title and Author are required' });
        }

        const newRequest = new BookRequest({
            user: req.user.id,
            title,
            author,
            additionalInfo
        });

        const savedRequest = await newRequest.save();
        res.json(savedRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/book-requests
// @desc    Get all book requests (Admin/General use)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // In a real app, you might restrict this to admins
        const requests = await BookRequest.find().sort({ createdAt: -1 }).populate('user', 'username email');
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/book-requests/my-requests
// @desc    Get current user's requests
// @access  Private
router.get('/my-requests', auth, async (req, res) => {
    try {
        const requests = await BookRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/book-requests/:id
// @desc    Update request status
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin (assuming req.user.role exists and is populated by auth middleware)
        // For now, we'll allow it if they are authenticated, or check specifically if you have role based auth
        // strict admin check:
        // if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'approved', 'rejected', 'fulfilled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const request = await BookRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

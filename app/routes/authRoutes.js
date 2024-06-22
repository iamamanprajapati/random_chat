const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { isValidUsername } = require('../utils/validation');

// Signup route
router.post('/signup', async (req, res) => {
    const { username, roomId } = req.body;

    if (!username || !roomId) {
        return res.status(400).json({ error: 'Username and room ID are required' });
    }

    if (!isValidUsername(username)) {
        return res.status(400).json({ error: 'Invalid username' });
    }

    try {
        const user = await User.createUser(username, roomId);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({ error: 'Room ID is required' });
    }

    try {
        const user = await User.getUserByRoomId(roomId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

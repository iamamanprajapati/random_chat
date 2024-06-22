// app/controllers/chatController.js

const chatService = require('../services/chatService');

function sendMessage(req, res) {
    const { roomId, message } = req.body;

    if (!roomId || !message) {
        return res.status(400).json({ error: 'roomId and message are required' });
    }

    chatService.sendMessage(roomId, message)
        .then(response => res.status(200).json(response))
        .catch(error => res.status(500).json({ error: error.message }));
}

module.exports = {
    sendMessage
};
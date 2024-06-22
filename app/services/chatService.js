// app/services/chatService.js

const ChatRoom = require('../models/chatRoom');

async function sendMessage(roomId, message) {
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
        throw new Error('Chat room not found');
    }
    // Add logic to save the message in the chat room
    return { roomId, message }; // Placeholder return
}

module.exports = {
    sendMessage
};
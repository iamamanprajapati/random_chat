// index.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2');
const dbConfig = require('./config/db.config');
const routes = require('./app/routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static('public'));
app.use('/api', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    waitForConnections: true,
    queueLimit: 0
});

const promisePool = pool.promise();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', async (msg, roomId) => {
        console.log(`Message received in room ${roomId}: ${msg}`);
        io.to(roomId).emit('chat message', msg);

        try {
            await promisePool.query(
                'INSERT INTO messages (content, room_id) VALUES (?, ?)',
                [msg, roomId]
            );
            console.log('Message saved to database');
        } catch (error) {
            console.error('Error saving message to database:', error);
        }
    });
});
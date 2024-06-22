// app/models/user.js

const mysql = require('mysql2');
const dbConfig = require('../../config/db.config');

// Create a MySQL pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    waitForConnections: true,
    queueLimit: 0
});

// Promisify the pool
const promisePool = pool.promise();

// Placeholder user model
class User {
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }

    static async createUser(username) {
        try {
            const [results] = await promisePool.query(
                'INSERT INTO users (username) VALUES (?)',
                [username]
            );
            return { id: results.insertId, username };
        } catch (error) {
            throw new Error(Error `creating user: ${error.message}`);
        }
    }

    static async getUserById(id) {
        try {
            const [results] = await promisePool.query(
                'SELECT * FROM users WHERE id = ?',
                [id]
            );
            if (results.length > 0) {
                const { id, username } = results[0];
                return new User(id, username);
            } else {
                return null;
            }
        } catch (error) {
            throw new Error(Error `fetching user: ${error.message}`);
        }
    }
}

module.exports = User;
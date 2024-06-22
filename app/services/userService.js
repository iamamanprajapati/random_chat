// app/services/userService.js

const User = require('../models/user');

async function createUser(username) {
    return User.createUser(username);
}

module.exports = {
    createUser
};
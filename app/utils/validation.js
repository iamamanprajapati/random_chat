// app/utils/validation.js

function isValidUsername(username) {
    return username.trim().length > 3;
}

module.exports = {
    isValidUsername
};
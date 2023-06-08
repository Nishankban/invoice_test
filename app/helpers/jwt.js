const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload, secretKey, expiresIn = '1h') => {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
};

// Verify JWT token
const verifyToken = (token, secretKey) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
};
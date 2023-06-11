const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload, secretKey, expiresIn = '48h') => {
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
const generateResetToken = () => {
    // Generate a random string for the reset token
    const resetToken = Math.random().toString(36).slice(-8);

    // Set the expiration time for the reset token (e.g., 1 hour from now)
    const expiresIn = '24h';

    // Generate the JWT token with the reset token and expiration time
    const token = jwt.sign({ resetToken }, process.env.JWT_RESET_SECRET, { expiresIn });

    return { token, expiresIn };
};

module.exports = {
    generateToken,
    verifyToken,
    generateResetToken
};
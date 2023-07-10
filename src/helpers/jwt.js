const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
// Generate JWT token
const generateToken = (payload, secretKey, expiresIn = '240h') => {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
};

// Verify JWT token

function extractToken (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

async function authenticateToken(req, res, next) {

    var token = extractToken(req);
    if (!token) {
        return res.status(403).json({
            auth: false,
            message: "No token provided.",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, function (error, decoded) {
        if (error) {
            console.log(error)
            return res.status(500).json({
                auth: error.message,
                message: "Failed to authenticate token.",
            });
        }

        req.userId = decoded.userId;
        next();
    });
};

const generateResetToken = () => {
    // Generate a random string for the reset token
    const resetToken = Math.random().toString(36).slice(-8);

    // Set the expiration time for the reset token (e.g., 1 hour from now)
    const expiresIn = '24h';

    // Generate the JWT token with the reset token and expiration time
    const token = jwt.sign({ resetToken }, 'my_rest_password', { expiresIn });

    return { token, expiresIn };
};

module.exports = {
    generateToken,
    authenticateToken,
    generateResetToken
};
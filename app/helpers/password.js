const bcrypt = require('bcrypt');

// Generate password hash
const generatePasswordHash = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

// Compare passwords
const comparePasswords = async (password, hash) => {
    const isPasswordValid = await bcrypt.compare(password, hash);
    return isPasswordValid;
};


module.exports = {
    generatePasswordHash,
    comparePasswords,
};
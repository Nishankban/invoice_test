const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, default: null },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    fcm:{
      type:String
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    lastSignInAt: {
        type: Date,
    },
    resetPasswordToken: String, // Add reset password token field
    resetPasswordExpires: Date, //
});

module.exports = mongoose.model('User', userSchema);
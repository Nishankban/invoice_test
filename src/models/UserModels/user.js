const mongoose = require('mongoose');

const bcrypt = require('bcrypt');


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

userSchema.methods.comparePassword = function (enteredPassword) {
    const user = this;
    return bcrypt.compare(enteredPassword, user.password);
};

// Create and export User model
const User = mongoose.model('User', userSchema);
module.exports = User;
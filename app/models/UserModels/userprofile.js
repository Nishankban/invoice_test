const mongoose = require('mongoose');

// Define the schema for user profile
const userProfileSchema = new mongoose.Schema({

    userPhoto:{type:String},
    // Business Info
    company: { type: String, required: true },
    owner: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    alternativeMobileNumber: { type: String },
    gstNumber: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },

    // Address
    address: {
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
    },

    // Bank Info
    bank: {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true },
    },
});

// Create the User Profile model
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;

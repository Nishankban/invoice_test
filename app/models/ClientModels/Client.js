const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientPhoto: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: {
        name: { type: String, required: true },
        personName: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        alternativeMobileNumber: { type: String },
        gstNumber: { type: String, required: true },
        email: { type: String, required: true },
        website: { type: String },
    },
    shippingAddress: {
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    billingAddress: {
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

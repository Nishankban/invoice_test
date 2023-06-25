// country.js
const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    id: Number,
    name: String,
    iso3: String,
    iso2: String,
    numeric_code: String,
    phone_code: String,
    capital: String,
    currency: String,
    currency_name: String,
    currency_symbol: String,
    tld: String,
    native: String,
    region: String,
    subregion: String,
    timezones: [String],
    latitude: Number,
    longitude: Number,
    emoji: String,
    emojiU: String,
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;

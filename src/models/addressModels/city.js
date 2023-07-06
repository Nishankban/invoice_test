// city.js
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    id: Number,
    name: String,
    state_id: Number,
    state_code: String,
    state_name: String,
    country_id: Number,
    country_code: String,
    country_name: String,
    latitude: Number,
    longitude: Number,
    wikiDataId: String,
});

const City = mongoose.model('City', citySchema);

module.exports = City;

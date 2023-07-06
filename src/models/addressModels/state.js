// state.js
const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    id: Number,
    name: String,
    country_id: Number,
    country_code: String,
    country_name: String,
    state_code: String,
    type: String,
    latitude: Number,
    longitude: Number,
});

const State = mongoose.model('State', stateSchema);

module.exports = State;

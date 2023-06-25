const Country = require('../models/addressModels/country');
const State = require('../models/addressModels/state');
const City = require('../models/addressModels/city');



// Retrieve all countries
const getCountries = async (req, res) => {
    try {
        const countries = await Country.find({}, { id: 1, name: 1, emoji: 1 });
        res.json({
            success:true,
            country_data:countries
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success:false,error: 'Internal server error' });
    }
};

// Retrieve states by country ID
const getStatesByCountryId = async (req, res) => {

    const countryId = req.params.countryId;
    console.log(countryId);
    try {
        const states = await State.find({ country_id: countryId }, { id: 1, name: 1, country_id: 1,country_name:1, });
        res.json(states);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Retrieve cities by state ID
const getCitiesByStateId = async (req, res) => {
    const stateId = req.params.stateId;
    try {
        const cities = await City.find({ state_id: stateId });
        res.json(cities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getCountries,
    getStatesByCountryId,
    getCitiesByStateId,
};

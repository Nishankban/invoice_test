const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Retrieve all countries
router.get('/countries', locationController.getCountries);

// Retrieve states by country ID
router.get('/states/:countryId', locationController.getStatesByCountryId);

// Retrieve cities by state ID
router.get('/cities/:stateId', locationController.getCitiesByStateId);

module.exports = router;
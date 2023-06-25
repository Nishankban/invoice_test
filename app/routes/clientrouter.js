const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const userController = require("../controllers/userProfileController");
const generateStorage = require('../helpers/multerhelper');
const {authenticateToken} = require("../helpers/jwt");

const upload = generateStorage('clientphoto');
// Create or Update Client
router.post('/clients/:clientId', authenticateToken, clientController.createOrUpdateClient);


router.get('/clients', authenticateToken, clientController.getClientsByUser);

// Get a particular Client by ID
router.get('/clients/:clientId', authenticateToken, clientController.getClientById).delete('/clients/:clientId', authenticateToken, clientController.deleteClient);


router.post('/clients/upload', upload.single('file'), clientController.uploadClientProfile);

module.exports = router;
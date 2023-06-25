const express= require('express');

const router = express.Router();
const generateStorage = require('../helpers/multerhelper');

const upload = generateStorage('userphoto');

const userController  = require('../controllers/userProfileController');

const {authenticateToken} = require('../helpers/jwt')

router.post('/user-profile',authenticateToken,userController.createOrUpdateUserProfile)
    .get(userController.getUserProfile)
    .delete(userController.deleteUserProfile);


router.post('/user-profile/upload', upload.single('file'), userController.uploadUserProfile);


module.exports = router;


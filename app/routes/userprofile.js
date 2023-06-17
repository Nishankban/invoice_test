const express= require('express');

const router = express.Router();
const generateStorage = require('../helpers/multerhelper');

const upload = generateStorage('userphoto');

const userController  = require('../controllers/userProfileController');


router.route('/user-profile')
    .post(userController.createOrUpdateUserProfile)
    .get(userController.getUserProfile)
    .delete(userController.deleteUserProfile);


router.post('/user-profile/upload', upload.single('file'), userController.uploadUserProfile);


module.exports = router;



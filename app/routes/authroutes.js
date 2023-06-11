const express= require('express');

const router = express.Router();

const {
    signInWithEmail,signInWithGoogle,signUpWithEmail,signUpWithGoogle,forgotPassword,verifyForgetPassword,resetPassword
}= require('../controllers/authcontroller');




router.route("/signin/google").post(signInWithGoogle);
router.route("/signup/google").post(signUpWithGoogle);


router.route("/forgotpassword").post(forgotPassword);
router.route("/verifyforgotpassword").get(verifyForgetPassword);
router.route("/resetpassword").post(resetPassword);



router.route("/signin/email").post(signInWithEmail);
router.route("/signup/email").post(signUpWithEmail);

module.exports = router;
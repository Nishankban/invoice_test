const User = require('../models/user');
const genverifypass = require('../helpers/password');
const myjwt = require('../helpers/jwt');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const {admin, firebaseapp} = require('../../index');
const nodemailer = require('nodemailer');
const pushnotification = require('../helpers/pushNotification');
const {sendPushNotification} = require("../helpers/pushNotification");
const {getMessaging} = require("firebase-admin/messaging");
const {response} = require("express");
// Sign up with email
const signUpWithEmail = async (req, res) => {
    try {
        const {email, password, fcm} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            if (existingUser.googleId && existingUser.password == null) {
                const hashpwd = await genverifypass.generatePasswordHash(password);
                // Update existing user
                await User.updateOne({email}, {$set: {password: hashpwd, fcm: fcm}});
                const token = myjwt.generateToken({userId: existingUser._id}, process.env.JWT_SECRET_KEY);
                return res.json({user: existingUser, token}); // Send user and token in the response
            } else {
                return res.status(400).json({error: 'User already exists'});
            }
        }

        // Hash the password
        const hashpwd = await genverifypass.generatePasswordHash(password);

        // Create new user
        const newUser = new User({
            email,
            password: hashpwd,
            fcm: fcm
        });
        await newUser.save();

        const token = myjwt.generateToken({userId: newUser._id}, process.env.JWT_SECRET_KEY);
        res.json({user: newUser, token}); // Send user and token in the response
    } catch (error) {
        console.log('Error signing up with email:', error);
        res.status(500).json({error: 'Failed to sign up with email'});
    }
};

// Sign in with email
const signInWithEmail = async (req, res) => {
    try {
        const {email, password, fcm} = req.body;

        // Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({error: 'No User found'});
        }

        if (user.password == null && user.googleId) {
            return res.status(400).json({error: 'User linked with Google'});
        }

        const isPasswordValid = genverifypass.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({error: 'Invalid password'});
        }
        user.fcm = fcm;
        // Generate JWT token
        user.lastSignInAt = new Date();
        await user.save();

        const token = myjwt.generateToken({userId: user._id}, process.env.JWT_SECRET_KEY);
        res.json({user, token}); // Send user and token in the response
    } catch (error) {
        console.log('Error signing in with email:', error);
        res.status(500).json({error: 'Failed to sign in with email'});
    }
};

// Sign up with Google
const signUpWithGoogle = async (req, res) => {
    try {
        const {email, googleId, fcm} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: 'User already exists'});
        }


        // Create new user
        const newUser = new User({
            email,
            googleId,
            fcm
        });
        await newUser.save();

        const token = myjwt.generateToken({userId: newUser._id}, process.env.JWT_SECRET_KEY);
        res.json({user: newUser, token}); // Send user and token in the response
    } catch (error) {
        console.log('Error signing up with Google:', error);
        res.status(500).json({error: 'Failed to sign up with Google'});
    }
};

// Sign in with Google
const signInWithGoogle = async (req, res) => {
    try {
        const {googleId, fcm} = req.body;

        // Check if user exists
        const user = await User.findOne({googleId});
        if (!user) {
            return res.status(400).json({error: 'User not found.Please do google sign up first'});
        }

        // Generate JWT token
        user.fcm = fcm
        user.lastSignInAt = new Date();
        await user.save();

        const token = myjwt.generateToken({userId: user._id}, process.env.JWT_SECRET_KEY);
        res.json({user, token}); // Send user and token in the response
    } catch (error) {
        console.log('Error signing in with Google:', error);
        res.status(500).json({error: 'Failed to sign in with Google'});
    }
};

const forgotPassword = async (req, res) => {
    try {
        const {email, fcm} = req.body;

        // Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({error: 'User not found'});
        }


        if(user.password == null){
            return res.status(400).json({error: 'User not signed up with mail'});
        }

        // Generate reset token
        const {token, expiresIn} = myjwt.generateResetToken();
        const durationString = '24h';

        const duration = parseDuration(expiresIn); // Convert the duration string to milliseconds


        console.log(myjwt.generateResetToken());
        user.resetPasswordToken = token.toString();
        const resetPasswordExpires = new Date(Date.now() + duration); // Calculate the expiration date/time

        user.resetPasswordExpires = resetPasswordExpires;
        user.fcm = fcm;
        await user.save();

        // to encode the generated reset passwordtoken and make short it
        const encodedToken = Buffer.from(token).toString('base64');


        const resetPasswordLink = `https://invoicetest-m7na.onrender.com/api/v1/verify/${encodedToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bansalnishank4@gmail.com',
                pass: 'tddwprtfvcgyftyw',
            },
        });

        const mailOptions = {
            from: 'bansalnishank4@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `Please confirm on the below link to confirm your reset password \n ${resetPasswordLink} request after confirming the request we suggest you to move back to app to reset password`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);


        res.json({message: 'Password reset instructions sent to email'});
    } catch (error) {
        console.log('Error in forgot password:', error);
        res.status(500).json({error: 'Failed to send password reset instructions'});
    }
};


const verifyForgetPassword = async (req, res) => {
    try {

        const { token } = req.query;
        const decodedToken = Buffer.from(token, 'base64').toString();

        const user = await User.findOne({
            resetPasswordToken: decodedToken.toString(),
            resetPasswordExpires: {$gt: Date.now()}
        });

        if (!user) {
            return res.status(400).json({error: 'Invalid or token got expired.'})
        }
        //get fcm data from user model and send the token to particular user for reset passowrd


        console.log(user.fcm)
        const message = {
            token: user.fcm, // Assuming the user's FCM token is stored in the 'fcm' field of the user model
            notification: {
                title: 'Password Reset',
                body: `${decodedToken}`,
            },

        };


        /*
              await sendPushNotification(user.fcm,token)
        */



        getMessaging().send(message).then((response) => {
            console.log('Successfully sent message:', response);

        }).catch((error) => {
            console.log('Error sending message:', error);

        });


/*
        console.log(admin.apps);
*/
        /*await ..send(message);*/
        res.redirect('/reset-success');


/*
        res.json({message: 'Password reset confirmation successful'});
*/


    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to verify reset password confirmation'});
    }
}
const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        // Check if token is valid and not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()},
        });
        if (!user) {
            return res.status(400).json({error: 'Invalid or expired reset token'});
        }

        // Generate new password hash
        const hashpwd = await genverifypass.generatePasswordHash(password);

        // Update user's password
        user.password = hashpwd;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({message: 'Password reset successfully'});
    } catch (error) {
        console.log('Error in reset password:', error);
        res.status(500).json({error: 'Failed to reset password'});
    }
};


function parseDuration(duration) {
    if (typeof duration !== 'string') {
        throw new Error('Invalid duration format');
    }

    const regex = /^(\d+)([smhdwMy]?)$/; // Regular expression to match the duration string
    const matches = duration.match(regex);
    if (!matches) {
        throw new Error('Invalid duration format');
    }

    const value = parseInt(matches[1]);
    const unit = matches[2];

    // Define the duration conversion values in milliseconds
    const conversion = {
        s: 1000, // seconds
        m: 1000 * 60, // minutes
        h: 1000 * 60 * 60, // hours
        d: 1000 * 60 * 60 * 24, // days
        w: 1000 * 60 * 60 * 24 * 7, // weeks
        M: 1000 * 60 * 60 * 24 * 30, // months (approximate)
        y: 1000 * 60 * 60 * 24 * 365 // years (approximate)
    };

    if (!conversion[unit]) {
        throw new Error('Invalid duration unit');
    }

    return value * conversion[unit];
}


module.exports = {
    signUpWithEmail,
    signInWithEmail,
    signUpWithGoogle,
    signInWithGoogle,
    forgotPassword,
    resetPassword,
    verifyForgetPassword
};

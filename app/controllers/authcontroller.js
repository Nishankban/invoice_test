const User = require('../models/user');
const genverifypass = require('../helpers/password');
const myjwt = require('../helpers/jwt');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
// Sign up with email
const signUpWithEmail = async (req, res) => {
    try {
        const { email, password ,fcm} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.googleId && existingUser.password == null) {
                const hashpwd = await genverifypass.generatePasswordHash(password);
                // Update existing user
                await User.updateOne({ email }, { $set: { password: hashpwd ,fcm:fcm} });
                const token = myjwt.generateToken({ userId: existingUser._id }, process.env.JWT_SECRET_KEY);
                return res.json({ user: existingUser, token }); // Send user and token in the response
            } else {
                return res.status(400).json({ error: 'User already exists' });
            }
        }

        // Hash the password
        const hashpwd = await genverifypass.generatePasswordHash(password);

        // Create new user
        const newUser = new User({
            email,
            password: hashpwd,
            fcm:fcm
        });
        await newUser.save();

        const token = myjwt.generateToken({ userId: newUser._id }, process.env.JWT_SECRET_KEY);
        res.json({ user: newUser, token }); // Send user and token in the response
    } catch (error) {
        console.log('Error signing up with email:', error);
        res.status(500).json({ error: 'Failed to sign up with email' });
    }
};

// Sign in with email
const signInWithEmail = async (req, res) => {
    try {
        const { email, password ,fcm} = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'No User found' });
        }

        if (user.password == null && user.googleId) {
            return res.status(400).json({ error: 'User linked with Google' });
        }

        const isPasswordValid = genverifypass.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        user.fcm=fcm;
        // Generate JWT token
        user.lastSignInAt = new Date();
        await user.save();

        const token = myjwt.generateToken({ userId: user._id }, process.env.JWT_SECRET_KEY);
        res.json({ user, token }); // Send user and token in the response
    } catch (error) {
        console.log('Error signing in with email:', error);
        res.status(500).json({ error: 'Failed to sign in with email' });
    }
};

// Sign up with Google
const signUpWithGoogle = async (req, res) => {
    try {
        const { email, googleId,fcm } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }



        // Create new user
        const newUser = new User({
            email,
            googleId,
            fcm
        });
        await newUser.save();

        const token = myjwt.generateToken({ userId: newUser._id }, process.env.JWT_SECRET_KEY);
        res.json({ user: newUser, token }); // Send user and token in the response
    } catch (error) {
        console.log('Error signing up with Google:', error);
        res.status(500).json({ error: 'Failed to sign up with Google' });
    }
};

// Sign in with Google
const signInWithGoogle = async (req, res) => {
    try {
        const { googleId ,fcm} = req.body;

        // Check if user exists
        const user = await User.findOne({ googleId });
        if (!user) {
            return res.status(400).json({ error: 'User not found.Please do google sign up first' });
        }

        // Generate JWT token
        user.fcm = fcm
        user.lastSignInAt = new Date();
        await user.save();

        const token = myjwt.generateToken({ userId: user._id }, process.env.JWT_SECRET_KEY);
        res.json({ user, token }); // Send user and token in the response
    } catch (error) {
        console.log('Error signing in with Google:', error);
        res.status(500).json({ error: 'Failed to sign in with Google' });
    }
};

module.exports = {
    signUpWithEmail,
    signInWithEmail,
    signUpWithGoogle,
    signInWithGoogle,
};

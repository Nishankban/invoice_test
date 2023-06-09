const User = require('../models/user');
const genverifypass = require('../helpers/password');
const myjwt = require('../helpers/jwt');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});


// Sign up with email
const signUpWithEmail = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: 'User already exists'});
        }

        // Hash the password
        const hashpwd = genverifypass.generatePasswordHash(password);


        // Create new user
        const newUser = new User({
            email,
            password: hashpwd,
        });
        await newUser.save();

        res.json({message: 'User created successfully'});
    } catch (error) {
        console.log('Error signing up with email:', error);
        res.status(500).json({error: 'Failed to sign up with email'});
    }
};

// Sign in with email
const signInWithEmail = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({error: 'Invalid email or password'});
        }

        // Compare passwords

        const isPasswordValid = genverifypass.comparePasswords(password, user.password);

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({error: 'Invalid email or password'});
        }

        // Generate JWT token
        user.lastSignInAt = new Date();
        await user.save();

        const token = myjwt.generateToken({userId: user._id}, process.env.JWT_SECRET_KEY)
        // const token = jwt.sign({ userId: user._id }, 'your-secret-key');

        res.json({token});
    } catch (error) {
        console.log('Error signing in with email:', error);
        res.status(500).json({error: 'Failed to sign in with email'});
    }
};

// Sign up with Google
const signUpWithGoogle = async (req, res) => {
    try {
        const {email, googleId} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: 'User already exists'});
        }

        // Create new user
        const newUser = new User({
            email,
            googleId,
        });
        await newUser.save();

        res.json({message: 'User created successfully'});
    } catch (error) {
        console.log('Error signing up with Google:', error);
        res.status(500).json({error: 'Failed to sign up with Google'});
    }
};

// Sign in with Google
const signInWithGoogle = async (req, res) => {
    try {
        const {googleId} = req.body;

        // Check if user exists
        const user = await User.findOne({googleId});
        if (!user) {
            return res.status(400).json({error: 'Invalid email or Google ID'});
        }

        // Generate JWT token
        user.lastSignInAt = new Date();
        await user.save();

        const token = myjwt.generateToken({userId: user._id}, process.env.JWT_SECRET_KEY)

        // const token = jwt.sign({ userId: user._id }, 'your-secret-key');

        res.json({token});
    } catch (error) {
        console.log('Error signing in with Google:', error);
        res.status(500).json({error: 'Failed to sign in with Google'});
    }
};

module.exports = {
    signUpWithEmail,
    signInWithEmail,
    signUpWithGoogle,
    signInWithGoogle,
};
const app = require('./app');

// const admin = require('config/firebase');

const connectDB = require('./config/database');
const firebaseadmin = require('./auth/firebaseAuth');

const port = process.env.PORT || 3000;

const admin = require("firebase-admin");
const serviceAccount = require('./config/serviceAccountKey.json');


// Initialize the admin app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://your-project-id.firebaseio.com',
});

// Export the initialized Firebase objects

connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error(err));

app.get('/', (req, res) => {

    res.send("Data first");


});

app.post('/login/google', async (req, res) => {
    const { idToken } = req.body;

    try {
        console.log("data")// Verify the authenticity of the Google sign-in credentials
        // const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Retrieve the user's unique identifier (UID) and other necessary information

      const decodedToken = await firebaseadmin.verifyGoogleToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;
        // Add other required user information as needed

        // Create a custom token for the user

        // Return the custom token as the response

        console.log(uid,email);
        res.json({ token: uid });
    } catch (error) {
        console.error('Google sign-in error:', error);
        res.status(500).json({ error: 'Google sign-in failed' });
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

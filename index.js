const app = require('./app');

const  admin = require( "../Invoice_manager_backend/config/firebase");

const connectDB = require('./config/database');


const port = process.env.PORT || 3000;
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
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Retrieve the user's unique identifier (UID) and other necessary information
        const uid = decodedToken.uid;
        const email = decodedToken.email;
        // Add other required user information as needed

        // Create a custom token for the user
        const customToken = await admin.auth().createCustomToken(uid);

        // Return the custom token as the response
        res.json({ token: customToken });
    } catch (error) {
        console.error('Google sign-in error:', error);
        res.status(500).json({ error: 'Google sign-in failed' });
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

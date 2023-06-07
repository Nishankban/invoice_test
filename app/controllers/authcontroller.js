import app from "../../app";
import {admin} from "../../config/firebase";




app.post('/login/google', async (req, res) => {
    const { idToken } = req.body;

    try {
        // Verify the authenticity of the Google sign-in credentials
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


app.post('/login/facebook', async (req, res) => {
    const { accessToken } = req.body;

    try {
        // Verify the authenticity of the Facebook access token
        const facebookUser = await admin.auth().verifyIdToken(accessToken, true);

        // Retrieve the user's unique identifier (UID) and other necessary information
        const uid = facebookUser.uid;
        const email = facebookUser.email;
        // Add other required user information as needed

        // Create a custom token for the user
        const customToken = await admin.auth().createCustomToken(uid);

        // Return the custom token as the response
        res.json({ token: customToken });
    } catch (error) {
        console.error('Facebook sign-in error:', error);
        res.status(500).json({ error: 'Facebook sign-in failed' });
    }
});

app.post('/signup/email', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Create a new user with the provided email and password
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        // Retrieve the user's unique identifier (UID)
        const uid = userRecord.uid;

        // Create a custom token for the user
        const customToken = await admin.auth().createCustomToken(uid);

        // Return the custom token as the response
        res.json({ token: customToken });
    } catch (error) {
        console.error('Email sign-up error:', error);
        res.status(500).json({ error: 'Email sign-up failed' });
    }
});

app.post('/login/google', async (req, res) => {
    const { idToken } = req.body;

    try {
        // Verify the authenticity of the Google sign-in credentials
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Retrieve the user's email and other necessary information
        const email = decodedToken.email;
        // Add other required user information as needed

        // Check if the user already exists in MongoDB
        const user = await findUserByEmail(email);

        if (user) {
            // User already exists, return the user details in the response
            res.json({ user });
        } else {
            // User does not exist, store the user details in MongoDB
            const uid = decodedToken.uid;
            await saveUserDetails(uid, email);

            // Create a custom token (JWT) for the user
            const customToken = generateCustomToken(uid);

            // Return the custom token as the response
            res.json({ token: customToken });
        }
    } catch (error) {
        console.error('Google sign-in error:', error);
        res.status(500).json({ error: 'Google sign-in failed' });
    }
});

// Function to find a user by email in MongoDB
async function findUserByEmail(email) {
    try {
        await client.connect();
        const db = client.db('your-db-name');
        const collection = db.collection('users');
        const user = await collection.findOne({ email });
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
    } finally {
        await client.close();
    }
}
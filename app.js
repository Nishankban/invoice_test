const express = require('express');
import {admin} from "../Invoice_manager_backend/config/firebase";

const app = express();
app.use(express.json());




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

// const morgan = require('morgan');

// const taskrouter = require('./routes/taskroutes');
// const userRouter = require('./routes/userroutes');
//
//
// // 1) MIDDLEWARES
// // if (process.env.NODE_ENV === 'development') {
// //   app.use(morgan('dev'));
// // }
//
// app.use(express.json());
// app.use(express.static(`${__dirname}/public`));
//
// app.use((req, res, next) => {
//     console.log(req.body);
//     console.log('Hello from the middleware 👋');
//     next();
// });
//
// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     next();
// });
//
// // 3) ROUTES
// // app.use('/api/v1/tours', taskRouter);
// app.use('/api/v1/users', userRouter,taskrouter);


module.exports = app;

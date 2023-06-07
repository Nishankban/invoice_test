const firebase = require('firebase');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');


// Initialize the admin app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://your-project-id.firebaseio.com',
});

// Export the initialized Firebase objects
module.exports = {
    firebase,
    admin,
};
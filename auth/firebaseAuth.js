const admin = require('firebase-admin');

async function verifyGoogleToken(idToken) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;



        return { uid, email };
    } catch (error) {
        // Handle any error that occurred during token verification
        throw new Error('Token verification failed: ' + error.message);
    }
}

async function verifyFacebookToken(accessToken) {
    try {
        const credential = admin.auth.FacebookAuthProvider.credential(accessToken);
        const result = await admin.auth().signInWithCredential(credential);
        const { uid, email } = result.user;


        return { uid, email };
    } catch (error) {
        // Handle any error that occurred during token verification
        throw new Error('Token verification failed: ' + error.message);
    }
}

module.exports = {
    verifyGoogleToken,
    verifyFacebookToken,
};
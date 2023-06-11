const app = require('./app');
const connectDB = require('./config/database');
const port = process.env.PORT || 3000;
const admin = require("firebase-admin");
const serviceAccount = require('./config/serviceAccountKey.json');
const { initializeApp } = require('firebase-admin/app');


const firebaseapp = initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://your-project-id.firebaseio.com',
});


connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error(err));

app.get('/', (req, res) => {

    res.send("Testing on this server");

    console.log("data")
});







app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

module.exports ={admin}
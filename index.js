const app = require('./app');


const connectDB = require('./config/database');

const port = process.env.PORT || 3000;

const admin = require("firebase-admin");
const serviceAccount = require('./config/serviceAccountKey.json');


// Initialize the admin app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://your-project-id.firebaseio.com',
});


connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error(err));

app.get('/', (req, res) => {

    res.send("Testing on this server");


});







app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

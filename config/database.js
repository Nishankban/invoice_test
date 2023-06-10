const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


const uri = `mongodb+srv://myadmin:admin@studentcluster.nxhqg6z.mongodb.net/?retryWrites=true&w=majority`;

function connectDB() {

    console.log("data")

    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = connectDB;
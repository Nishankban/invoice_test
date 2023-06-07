const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@studentcluster.nxhqg6z.mongodb.net/?retryWrites=true&w=majority`;

function connectDB() {
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = connectDB;
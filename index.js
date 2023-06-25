const app = require('./app');
const connectDB = require('./config/database');
const port = process.env.PORT || 3000;
const admin = require("firebase-admin");
const serviceAccount = require('./config/serviceAccountKey.json');
const { initializeApp } = require('firebase-admin/app');
const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const Country = require('./app/models/addressModels/country');
const State = require('./app/models/addressModels/state');
const City = require('./app/models/addressModels/city');


/*const firebaseapp = initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://your-project-id.firebaseio.com',
});*/


connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error(err));

app.get('/', (req, res) => {

    res.send("Testing on this server");

    console.log("data")
});


/*
fs.createReadStream('data/countries.csv')
    .pipe(csv())
    .on('data', (row) => {
        const country = new Country(row);
        country.save();
    })
    .on('end', () => {
        console.log('Countries data imported successfully.');
    });

// Import states
fs.createReadStream('data/states.csv')
    .pipe(csv())
    .on('data', (row) => {
        const state = new State(row);
        state.save();
    })
    .on('end', () => {
        console.log('States data imported successfully.');
    });

// Import cities
fs.createReadStream('data/cities.csv')
    .pipe(csv())
    .on('data', (row) => {
        const city = new City(row);
        city.save();
    })
    .on('end', () => {
        console.log('Cities data imported successfully.');
    });*/


const importAllCities = async () => {
    return new Promise((resolve, reject) => {
        const citiesToImport = [];
        fs.createReadStream('data/cities.csv')
            .pipe(csv())
            .on('data', (row) => {
                citiesToImport.push(row);
            })
            .on('end', async () => {
                try {
                    for (const city of citiesToImport) {
                        const { id } = city;
                        const existingCity = await City.findOne({ id });
                        if (!existingCity) {
                            const newCity = new City(city);
                            await newCity.save();
                        }
                    }
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
    });
};

// Import all cities
importAllCities()
    .then(() => {
        console.log('All cities imported successfully.');
    })
    .catch((err) => {
        console.error('Error importing cities:', err);
    });




app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});



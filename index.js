const app = require('./app');


const connectDB = require('./config/database');


const port = process.env.PORT || 3000;
connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error(err));

app.get('/', (req, res) => {

    res.send("Data first");


});
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

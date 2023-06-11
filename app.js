const express = require('express');
const {
    verifyForgetPassword
}= require('../invoice_test/app/controllers/authcontroller');
const app = express();



app.use(express.json());

const authrouter = require('./app/routes/authroutes');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use('/api/v1',authrouter);
app.post('/verify',verifyForgetPassword)
app.get('/reset-success', (req, res) => {
    res.sendFile(__dirname + '/views/reset-success.html');
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

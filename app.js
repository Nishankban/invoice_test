const express = require('express');

const app = express();

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

/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorControllers');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRouts');
const userRouter = require('./routes/userRouts');
const reviewRouter = require('./routes/reviewRouts');
const viewsRouter = require('./routes/viewsRouts');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(helmet());

//mode Middleware
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'devlopment') {
  app.use(morgan('tiny'));
}

// app.use(cors({ origin: '*' }));

//Reques per IP Limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests feom this IP please try again after an hour',
});

app.use('/api', limiter);

//Data sanitizer for no-sql attack
app.use(mongoSanitize());

app.use(xss());

// app.use((req, res, next) => {
//   res.set('Access-Control-Allow-Origin', '*');
//   next();
// });

app.use((req, res, next) => {
  //allow access from every, elminate CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.removeHeader('x-powered-by');
  //set the allowed HTTP methods to be requested
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  //headers clients can use in their requests
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  //allow request to continue and be handled by routes
  next();
});

//public-repository middleware
app.use(express.static(path.join(__dirname, 'public')));

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

//Http Parameter Polution
app.use(
  hpp([
    'duration',
    'price',
    'difficulty',
    'ratingsAverage',
    'ratingsQuantity',
    'maxGroupSize',
  ])
);

//diffining different routs middleware

app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//Undefined routes middleware (genrates error)
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cann't find ${req.originalUrl} on the server`,
  // });
  // const err = new Error(`Cann't find ${req.originalUrl} on the server`);
  // console.log(err.stack);
  // err.statusCode = 404;
  // err.status = 'fail';
  next(new AppError(`Cann't find ${req.originalUrl} on the server`, 404));
});

// Global Error Middleware
app.use(globalErrorHandler);

// app.get('/api/v1/tours', getTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.delete('/apt/v1/tours/:id', deleteTour);
// app.patch('/apt/v1/tours/:id', updateTour);

module.exports = app;

/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION SHUTTING DOWN THE APP');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env)
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  // eslint-disable-next-line no-unused-vars
  .then((con) => {
    // console.log(con.connection);
    console.log('conected to database');
  });

const port = 3001 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`listening requests on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandaled Rejection shutting down the app');
  server.close(() => {
    process.exit(1);
  });
});

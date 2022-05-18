/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: './config.env' });

const Tour = require(`../../model/toueModel`);
// const User = require(`../../model/userModel`);
// const Review = require(`../../model/reviewModel`);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  // eslint-disable-next-line no-unused-vars
  .then((con) => {
    console.log('conected to database');
  });

// const tour = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));
const tour = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
// const user = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
// const review = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

const importData = async () => {
  try {
    await Tour.create(tour);
    // await User.create(user, { validateBeforeSave: false });
    // await Review.create(review);
    console.log('data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log('deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

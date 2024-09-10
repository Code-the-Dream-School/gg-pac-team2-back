require('dotenv').config();

const connectDB = require('../conn');
const RideRequest = require('../../models/requestModel');

const rideRequests = require('./testRequests.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await RideRequest.deleteMany();
    await RideRequest.create(rideRequests);
    console.log('Success seeding ride requests database!!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();

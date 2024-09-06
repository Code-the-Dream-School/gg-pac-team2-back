require('dotenv').config();

const connectDB = require('./db/conn');
const users = require('./models/usersModel');

const testUsers = require('./testUsers.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await users.deleteMany();
    await users.create(testUsers);
    console.log('Success seeding database!!!!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
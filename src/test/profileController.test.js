const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/usersModel');

chai.use(chaiHttp);
chai.should();

async function connectDB() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

async function disconnectDB() {
  await mongoose.connection.close();
};

describe('Profile Controller', function () {
  let token;

  before(async () => {
    await connectDB();

    await User.create({
      parentName: 'Test User',
      email: 'test.user@test.com',
      password: 'secret'
    });

    const res = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test.user@test.com',
        password: 'secret'
      });

    token = res.body.token;
  });

  after(async () => {
    await disconnectDB();
  });

  // Read Profile
  describe('GET /api/v1/profile', function () {
    it('should return authenticated user\'s profile', async function () {
      // Test
    });
  });

  // Update Profile
  describe('PATCH /api/v1/profile', function () {
    it('should update authenticated user\'s profile', async function () => {
      // Test
    });
  });

  // Read All Profiles
  describe('GET /api/v1/profile/allprofiles', function () {
    it('should retrieve and list all user profiles', async function () {
      // Test
    });
  });

  // Read Profile by ID
  describe('GET /api/v1/profile/:id', function () {
    it('should retrieve a user profile by ID', async function () {
      //Test
    });
  });

  // Delete Profile
  describe('DELETE /api/v1/profile/:id', function () {
    it('should delete user profile', async function () {
      // Test
    });
  });
});



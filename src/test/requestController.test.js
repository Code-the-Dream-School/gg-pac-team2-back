const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/usersModel');
const RideRequest = require('../models/requestModel');

chai.use(chaiHttp);
chai.should();

async function connectDB() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function disconnectDB() {
  await mongoose.connection.close();
}

async function cleanupTestRequests() {
  await RideRequest.deleteMany({
    pickupLocation: { $regex: /Test St/ },
  });
  await RideRequest.deleteMany({
    dropoffLocation: { $regex: /Test St/ },
  });
}

describe('Ride Request Controller', function () {
  this.timeout(15000);

  before(async function () {
    await connectDB();
    await cleanupTestRequests();
  });

  after(async () => {
    await cleanupTestRequests();
    await disconnectDB();
  });

  describe('POST /api/v1/requests', function () {
    it('should create a new ride request', async function () {
      const requester = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send({
          parentName: 'Test Requester',
          email: 'test.requester@test.com',
          password: 'secret',
        })

      const token = requester.body.token;

      const profile = await User.create({
        parentName: 'Test Profile',
        email: 'test.profile@test.com',
        password: 'secret',
      });

      const res = await chai
        .request(app)
        .post('/api/v1/requests')
        .set('Authorization', `Bearer ${token}`)
        .send({
          requestedBy: requester._id,
          profile: profile._id,
          requestedDropOffDays: ['Monday', 'Wednesday', 'Friday'],
          requestedPickupDays: ['Tuesday', 'Thursday'],
        });

      res.should.have.status(201);
    });
  });
});

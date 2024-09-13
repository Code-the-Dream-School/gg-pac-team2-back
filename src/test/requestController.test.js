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
      const requesterRes = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send({
          parentName: 'Test Requester',
          email: 'test.requester@test.com',
          password: 'secret',
        });

      // console.log('Requester Response:', requesterRes.body);

      const token = requesterRes.body.token;
      const requesterId = requesterRes.body.user._id.toString();

      // requesterId.should.not.be.undefined;

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
          requester: requesterId,
          profile: profile._id,
          requestedDropOffDays: ['Monday', 'Wednesday', 'Friday'],
          requestedPickUpDays: ['Tuesday', 'Thursday'],
        });

      // console.log('Ride request response body:', res.body);

      res.should.have.status(201);
      res.body.should.be.an('object');
      res.body.should.have.property('rideRequest');
      res.body.rideRequest.should.have
        .property('requester')
        .eql(requesterId);
      res.body.rideRequest.should.have
        .property('profile')
        .eql(profile._id.toString());
      res.body.rideRequest.should.have
        .property('requestedDropOffDays')
        .eql(['Monday', 'Wednesday', 'Friday']);
      res.body.rideRequest.should.have
        .property('requestedPickUpDays')
        .eql(['Tuesday', 'Thursday']);
    });
  });

  // describe('GET /api/v1/requests/:id', function () {
  //   it('should get a ride request by ID', async function () {
  //     const requesterRes = await chai
  //       .request(app)
  //       .post('/api/v1/auth/register')
  //       .send({
  //         parentName: 'Test Requester',
  //         email: 'test.requester@test.com',
  //         password: 'secret',
  //       });

  //     console.log('Requester response', requesterRes.body);

  //     const token = requesterRes.body.token;
  //     const requesterId = requesterRes.body.user._id.toString();

  //     const profile = await User.create({
  //       parentName: 'Test Profile',
  //       email: 'test.profile@test.com',
  //       password: 'secret',
  //     });

  //     const createRequestRes = await chai
  //       .request(app)
  //       .post('/api/v1/requests')
  //       .set('Authorization', `Bearer {token}`)
  //       .send({
  //         requester: requesterId,
  //         profile: profile._id,
  //         requestedDropOffDays: ['Monday', 'Wednesday', 'Friday'],
  //         requestedPickUpDays: ['Tuesday', 'Thursday'],
  //       });

  //     console.log(
  //       'Ride request creation response:',
  //       createRequestRes.body
  //     );

  //     const rideRequestId = createRequestRes.body.rideRequest._id;

  //     const res = await chai
  //       .request(app)
  //       .get(`/api/v1/requests/${rideRequestId}`)
  //       .set('Authorization', `Bearer ${token}`);

  //     console.log('Ride request response body:', res.body);
  //   });
  // });
});

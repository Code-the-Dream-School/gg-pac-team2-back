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
    useUnifiedTopology: true,
  });
}

async function disconnectDB() {
  await mongoose.connection.close();
}

describe('Profile Controller', function () {
  let token;
  let testerId;

  before(async function () {
    this.timeout(10000);

    await connectDB();

    await User.create({
      parentName: 'Test User',
      email: 'test.user@test.com',
      password: 'secret',
    });

    const res = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test.user@test.com',
        password: 'secret',
      });

    token = res.body.token;

    const idTester = await User.create({
      parentName: 'Test User 2',
      email: 'test2.user@test.com',
      password: 'secret',
    });

    testerId = idTester._id.toString();
  });

  after(async () => {
    await disconnectDB();
  });

  // Read Profile
  describe('GET /api/v1/profile', function () {
    it("should return authenticated user's profile", async function () {
      this.timeout(15000);

      const res = await chai
        .request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${token}`);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.user.should.have.property(
        'email',
        'test.user@test.com'
      );
    });
  });

  // Update Profile
  describe('PATCH /api/v1/profile', function () {
    it("should update authenticated user's profile", async function () {
      this.timeout(15000);

      const res = await chai
        .request(app)
        .patch('/api/v1/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          parentName: 'Updated User',
          email: 'updated.user@test.com',
          numberOfSeatsInCar: 3,
          neighborhood: 'New Neighborhood',
        });

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.user.should.have.property(
        'parentName',
        'Updated User'
      );
      res.body.user.should.have.property(
        'email',
        'updated.user@test.com'
      );
    });
  });

  // Read All Profiles
  describe('GET /api/v1/profile/allprofiles', function () {
    it('should retrieve and list all user profiles', async function () {
      await User.create([
        {
          parentName: 'User One',
          email: 'user.one@test.com',
          password: 'secret',
        },
        {
          parentName: 'User Two',
          email: 'user.two@test.com',
          password: 'secret',
        },
      ]);

      const res = await chai
        .request(app)
        .get('/api/v1/profile/allprofiles')
        .set('Authorization', `Bearer ${token}`);

      console.log('Response body:', res.body);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('users');
      res.body.users.should.be.an('array');
      res.body.users.length.should.be.greaterThan(1);
      res.body.users.forEach((profile) => {
        profile.should.have.property('parentName');
        profile.should.have.property('email');
      });
    });
  });

  // Read Profile by ID
  describe('GET /api/v1/profile/:id', function () {
    it('should retrieve a user profile by ID', async function () {
      const res = await chai
        .request(app)
        .get(`/api/v1/profile/${testerId}`)
        .set('Authorization', `Bearer ${token}`);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('user');
      res.body.user.should.have.property('_id').eql(testerId);
      res.body.user.should.have
        .property('parentName')
        .eql('Test User 2');
      res.body.user.should.have
        .property('email')
        .eql('test2.user@test.com');
    });
  });

  // Delete Profile
  describe('DELETE /api/v1/profile/:id', function () {
    it('should delete user profile', async function () {
      // Test
    });
  });
});

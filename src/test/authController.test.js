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

async function cleanupTestUsers() {
  await User.deleteMany({ email: /@test.com$/ });
}

describe('Authentication Controller', function () {
  this.timeout(15000);

  before(async () => {
    this.timeout(15000);
    await connectDB();
    await cleanupTestUsers();
  });

  after(async () => {
    await cleanupTestUsers();
    await disconnectDB();
  });

  describe('Register', function () {
    it('should register new user and return token', async function () {
      this.timeout(15000);

      const res = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send({
          parentName: 'Test User',
          email: 'test.user@test.com',
          password: 'secret',
        });

      res.should.have.status(201);
      res.body.should.be.an('object');
      res.body.should.have.property('user');
      res.body.user.should.have.property('parentName', 'Test User');
      res.body.user.should.have.property(
        'email',
        'test.user@test.com'
      );
      res.body.should.have.property('token');

      const user = await User.findOne({
        email: 'test.user@test.com',
      });
      user.should.not.be.null;
    });
  });

  describe('Login', function () {
    it('should log in user and return token', async function () {
      this.timeout(15000);

      const userBeforeLogin = await User.findOne({
        email: 'test.user@test.com',
      });
      console.log('User before login attempt', userBeforeLogin);

      const res = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test.user@test.com',
          password: 'secret',
        });

      console.log('Login response body:', res.body);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('user');
      res.body.user.should.have.property('name', 'Test User');
      res.body.should.have.property('token');
    });
  });
});

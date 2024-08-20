const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require('mongoose');

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
};

describe('Authentication Controller - Register', function () {
  before(async () => {
    await connectDB();
  });

  after(async () => {
    await disconnectDB();
  });

  it('should register a new user and return a token', (done) => {
    this.timeout(15000);

    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        parentName: 'John',
        email: 'john@gmail.com',
        password: 'secret',
      })
      .end((err, res) => {
        console.log('Error:', err);
        console.log('Response:', res.body);
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.should.have.property('user');
        res.body.user.should.have.property('parentName', 'John');
        res.body.user.should.have.property('email', 'john@gmail.com');
        res.body.should.have.property('token');
        done();
      });
  });
});

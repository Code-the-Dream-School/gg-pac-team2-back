const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Authentication Controller - Register', () => {
  it('should register a new user and return a token', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        parentName: 'John',
        email: 'john@gmail.com',
        password: 'secret',
      })
      .end((err, res) => {
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

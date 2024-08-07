const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  res.send('register user');
};

const login = async (req, res) => {
  res.send('login user');

  const token = jwt.sign({})
};

module.exports = {
  register,
  login,
};

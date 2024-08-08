const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  res.send('register user');
};

const login = async (req, res) => {
  const { username, password } = req.body;

  // temp
  const id = new Date().getDate();

  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).json({ msg: 'login user', token });
};

module.exports = {
  register,
  login,
};

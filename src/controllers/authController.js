const jwt = require('jsonwebtoken');

// hardcoded User for testing
const users = [
  {
    id: 1,
    name: "Jack",
    email: "jack@gmail.com",
    password: "secret"
  }
]

// Register controller
const register = async (req, res) => {
  // Add new user to hardcoded array
  const { name, email, password } = req.body;
  const user = { id: new Date().getDate(), name, email, password };
  users.push(user);
  // const user = await User.create({ ...req.body });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  // const token = user.createJWT();

  res.status(201).json({ user: { name: user.name }, token });
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check for user in hardcoded array
  const user = users.find(user => user.email === email)

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  // const token = user.createJWT();


  res.status(200).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};

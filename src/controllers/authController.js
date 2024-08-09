const jwt = require('jsonwebtoken');
const User = require('../models/usersModel.js')

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
  try {
    // Extract data from request body
    const { parentName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ parentName, email, password });

    // Generate JWT token and save it in the user document
    const token = user.generateAuthToken();

    // Save the user to the database
    await user.save();

    // Respond with user data and token
    res.status(201).json({
      user: {
        parentName: user.parentName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
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

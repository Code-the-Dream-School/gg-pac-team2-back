const jwt = require('jsonwebtoken');
const User = require('../models/usersModel.js');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

// Register controller
const register = async (req, res) => {
  try {
    // Extract data from request body
    const { parentName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    // Create a new user
    const user = new User({ parentName, email, password });

    // Generate JWT token and save it in the user document
    const token = user.generateAuthToken();

    // Save the user to the database
    await user.save();

    // Respond with user data and token
    res.status(StatusCodes.CREATED).json({
      user: {
        parentName: user.parentName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};


// Login controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials');
    };

    const isPasswordCorrect = await user.comparePassword(password);
    console.log('Password correct:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials');
    };

    const token = user.generateAuthToken();
    console.log('Generated Token:', token);

    res.status(StatusCodes.OK).json({ user: { name: user.parentName }, token });
  } catch (error) {
    console.error('Login Error;', error);
    next(error);
  };
};

module.exports = {
  register,
  login,
};

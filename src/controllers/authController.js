const jwt = require('jsonwebtoken');
const formdata = require('form-data')
const Mailgun = require('mailgun.js')
const mailgun = new Mailgun(formdata)
const User = require('../models/usersModel.js');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors');

// Create the maildun client
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || 'apiKey',
  domain: process.env.MAILGUN_DOMAIN || 'sandbox-123.mailgun.org'
});

// Register controller
const register = async (req, res, next) => {
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

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials');
    };

    const token = await user.generateAuthToken();

    res.status(StatusCodes.OK).json({ user: { name: user.parentName }, token });
  } catch (error) {
    console.error('Login Error;', error);
    next(error);
  };
};


// Forgot Password Controller
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('No user found with that email');
  }

  // Generate a reset token
  const resetToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Send reset link via email
  const resetUrl = `http://localhost:5173/reset-password/${user._id}/${resetToken}`;

  const data = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password reset',
    text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`
  };

  mg.messages.create(process.env.MAILGUN_DOMAIN, data)
    .then(() => {
      res.status(StatusCodes.OK).json({ message: 'Password reset link sent to your email' });
    })
    .catch(error => {
      console.error('Error sending email:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send email' });
    });
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Verify the reset token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new BadRequestError("Token is invalid or has expired");
  }

  // Find the user by ID
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Update the user's password and remove tokens
  user.password = password;
  user.tokens = [];

  await user.save();

  res.status(StatusCodes.OK).json({ message: "Password has been reset successfully" });
};


module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};

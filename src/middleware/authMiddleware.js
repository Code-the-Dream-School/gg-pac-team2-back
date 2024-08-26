const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, parentName: payload.parentName };
    console.log('Authenticated user:', req.user);
  } catch {
    throw new UnauthenticatedError('Authentication invalid');
  };

  next();
};

module.exports = authenticationMiddleware;
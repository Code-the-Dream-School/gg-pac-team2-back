const User = require('../models/usersModel');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const readProfile = async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError(`No profile found for user with id ${userId}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const updateProfile = async (req, res) => {
  const {
    body: { parentName, email, password },
    user: { userId }
  } = req;

  if (!parentName || !email) {
    throw new BadRequestError('Parent name and email are required');
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new NotFoundError(`No profile found for user with id ${userId}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  readProfile,
  updateProfile
};
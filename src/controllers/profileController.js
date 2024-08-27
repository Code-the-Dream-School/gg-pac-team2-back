const User = require('../models/usersModel');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors');

const readAllProfiles = async (req, res) => {
  const users = await User.find({}).select('-password -tokens')

  res.status(StatusCodes.OK).json({ users });
}

const readProfile = async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError(`No profile found for user with id ${userId}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const viewProfileById = async (req, res) => {
  const { id: profileId } = req.params

  const user = await User.findById(profileId).select('-password -tokens')

  if ( !user ) {
    throw new NotFoundError(`No profile found for user with id ${profileId}`)
  }

  res.status(StatusCodes.OK).json({ user });
}


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

const deleteProfile = async (req, res) => {
  const { userId } = req.user;
  const { id: profileId } = req.params;

  if ( userId != profileId ) {
    throw new ForbiddenError('You are not authorized to delete this profile')
  }

  const user = await User.findByIdAndDelete(profileId)

  if ( !user ) {
    throw new NotFoundError(`No profile found for user with id ${profileId}`)
  }

  res.status(StatusCodes.OK).json({ msg: "Profile deleted successfully "});
}
 
module.exports = {
  readProfile,
  updateProfile,
  deleteProfile,
  readAllProfiles,
  viewProfileById
};
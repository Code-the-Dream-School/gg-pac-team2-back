const User = require('../models/usersModel');
const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors');

// API to view All Profiles
const readAllProfiles = async (req, res) => {
  const { numberOfSeatsInCar, availableDropOffDays, availablePickUpDays, neighborhood, sort, fields, page, limit } = req.query;
  const queryObject = {};

  if (numberOfSeatsInCar) {
    queryObject.numberOfSeatsInCar = { $gte: Number(numberOfSeatsInCar) };
  }

  if (availableDropOffDays) {
    queryObject.availableDropOffDays = { $in: availableDropOffDays.split(',') }
  }

  if (availablePickUpDays) {
    queryObject.availablePickUpDays = { $in: availablePickUpDays.split(',') };
  }

  if (neighborhood) {
    queryObject.neighborhood = neighborhood;
  }

  let result = User.find(queryObject).select('-password -tokens');
  // const users = await User.find({}).select('-password -tokens');

  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(Number(limit));

  const users = await result;

  res.status(StatusCodes.OK).json({ users });
};

// API to view own Profile
const readProfile = async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError(
      `No profile found for user with id ${userId}`
    );
  }

  res.status(StatusCodes.OK).json({ user });
};

// API to view another user profile
const viewProfileById = async (req, res) => {
  const { id: profileId } = req.params;

  const user = await User.findById(profileId).select(
    '-password -tokens'
  );

  if (!user) {
    throw new NotFoundError(
      `No profile found for user with id ${profileId}`
    );
  }

  res.status(StatusCodes.OK).json({ user });
};

// API to update own user profile
const updateProfile = async (req, res) => {
  const { user: { userId } } = req;

  // Filter out undefined or empty fields in req.body to avoid overwriting existing data
  const updatedData = Object.fromEntries(
    Object.entries(req.body).filter(([_, value]) => value !== undefined && value !== '')
  );

  if (Object.keys(updatedData).length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No valid data to update" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError(`No profile found for user with id ${userId}`);
    }

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};


// API to delete own user profile
const deleteProfile = async (req, res) => {
  const { userId } = req.user;
  const { id: profileId } = req.params;

  if (userId != profileId) {
    throw new ForbiddenError(
      'You are not authorized to delete this profile'
    );
  }

  const user = await User.findByIdAndDelete(profileId);

  if (!user) {
    throw new NotFoundError(
      `No profile found for user with id ${profileId}`
    );
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Profile deleted successfully' });
};

// API to change password from profile
const changePassword = async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;
  const { id: profileId } = req.params;

  if (userId != profileId) {
    throw new ForbiddenError(
      'You are not authorized to change the password of this profile'
    );
  }

  const user = await User.findById(profileId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid current Password');
  }

  user.password = newPassword;
  user.tokens = [];
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Password changed Successfully' });
};

module.exports = {
  readProfile,
  updateProfile,
  deleteProfile,
  readAllProfiles,
  viewProfileById,
  changePassword,
};
const RideRequest = require('../models/requestModel');
const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors');

// Create a new request
const createRequest = async (req, res) => {
  const { profile, requestedDropOffDays, requestedPickUpDays } =
    req.body;

  console.log('Authenticated user:', req.user);

  if (!req.user || !req.user.userId) {
    throw new BadRequestError('User not authenticated');
  }

  const rideRequest = await RideRequest.create({
    requester: req.user.userId,
    profile,
    requestedDropOffDays,
    requestedPickUpDays,
  });

  res.status(StatusCodes.CREATED).json({ rideRequest });
};

module.exports = {
  createRequest,
};

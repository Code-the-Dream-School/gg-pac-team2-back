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

  // console.log('Authenticated user:', req.user);

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

// Read a single request
const readRequest = async (req, res) => {
  const { id: requestId } = req.params;
  const userId = req.user.userId;

  const request = await RideRequest.findById(requestId)
    .populate('requester profile')
    .populate('profile');

  if (!request) {
    throw new NotFoundError(`No request found with id ${requestId}`);
  }

  if (
    !request.requester.equals(userId) &&
    !request.profile.equals(userId)
  ) {
    throw new ForbiddenError(
      'You do not have permission to view this request'
    );
  }

  res.status(StatusCodes.OK).json({ request });
};

module.exports = {
  createRequest,
  readRequest,
};

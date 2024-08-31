const RideRequest = require('../models/requestModel');
const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors');

// Create a new request
const createRequest = async (req, res) => {
  const {
    requestedDropOffDays,
    requestedPickUpDays,
    selectedChildren,
    phoneNumber,
  } = req.body;

  const rideRequest = await RideRequest.create({
    requester: req.user._id,
    requestedDropOffDays,
    requestedPickUpDays,
    selectedChildren,
    phoneNumber,
  });

  res.status(StatusCodes.CREATED).json({ rideRequest });
};

module.exports = {
  createRequest
};

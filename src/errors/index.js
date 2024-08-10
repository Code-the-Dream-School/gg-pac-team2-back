const CustomAPIError = require('./customError');
const BadRequestError = require('./badRequest');
const UnauthenticatedError = require('./unauthenticatedError');
const NotFoundError = require('./notFound');

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
};
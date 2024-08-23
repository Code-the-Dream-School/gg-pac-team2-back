const CustomAPIError = require('./customAPIError');
const BadRequestError = require('./badRequest');
const UnauthenticatedError = require('./unauthenticatedError');
const NotFoundError = require('./notFound');
const ForbiddenError = require('./forbidden')

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  ForbiddenError
};

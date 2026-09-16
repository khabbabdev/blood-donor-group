const { ErrorResponse } = require('./errorHandler');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user ? req.user.role : 'Unknown'} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};

module.exports = { authorize };

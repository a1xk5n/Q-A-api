const ForbiddenError = require('../errorHandlers/httpErrors/forbiddenError');

const adminMiddleware = (req, res, next) => {
    const isAdmin = req.decodedInfo.isAdmin;

    if (isAdmin) {
        next();
    } else {
        next(new ForbiddenError());
    }
};

module.exports = adminMiddleware;

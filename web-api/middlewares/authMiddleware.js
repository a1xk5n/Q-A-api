const jwt = require('jsonwebtoken');
const config = require('../../configuration');
const UnAuthorizedError = require('../errorHandlers/httpErrors/unauthorizedError');

const authMiddleware = (req, res, next) => {
    const token = req.cookies['Autorization'];
    if (token) {
        jwt.verify(token, config.get('secret'), (err, decoded) => {
            if (err) {
                next(new UnAuthorizedError());
            }

            req.decodedInfo = {
                userId: decoded.id,
                userLogin: decoded.login,
                userRole: decoded.role,
                isAdmin: decoded.role === 'admin',
            };

            next();
        });
    } else {
        next(new UnAuthorizedError());
    }
};

module.exports = authMiddleware;

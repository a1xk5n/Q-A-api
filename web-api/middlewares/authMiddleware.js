const jwt = require('jsonwebtoken');
const config = require('../../configuration');
const UnAuthorizedError = require('../errorHandlers/httpErrors/unauthorizedError');

const authMiddleware = (req, res, next) => {
    const token = req.cookies['Autorization'];
    if (token) {
        jwt.verify(token, config.get('secret'), (err, decoded) => {
            if (err) {
                res.clearCookie('Autorization');
                next(new UnAuthorizedError());
            }

            req.decodedInfo = {
                userId: decoded.id,
                userLogin: decoded.login,
                userRole: decoded.role,
                isAdmin: decoded.role === 'admin',
            };

            const updatedToken = jwt.sign(
                { id: decoded.id, login: decoded.login, role: decoded.role },
                config.get('secret'),
                {
                    expiresIn: 900,
                },
            );

            res.cookie('Autorization', updatedToken);

            next();
        });
    } else {
        next(new UnAuthorizedError());
    }
};

module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const config = require('../../configuration');

const isAuthorized = (req, res, next) => {
    const token = req.cookies['Autorization'];
    if (token) {
        jwt.verify(token, config.get('secret'), (err, decoded) => {
            if (!err) {
                req.decodedInfo = {
                    userId: decoded.id,
                    userLogin: decoded.login,
                    userRole: decoded.role,
                    isAdmin: decoded.role === 'admin',
                };
            } else {
                res.clearCookie('Autorization');
            }

            next();
        });
    } else {
        next();
    }
};

module.exports = isAuthorized;

'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../configuration');

const UserRepository = require('../../data-access/repositories/userRepository');

const NotFoundHttpError = require('../../web-api/errorHandlers/httpErrors/notFoundError');
const BadRequestError = require('../../web-api/errorHandlers/httpErrors/badRequest');

class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    register({ userName, password, role }) {
        return new Promise((resolve, reject) => {
            const hashedPassword = bcrypt.hashSync(password, 8);

            const user = {
                userName,
                password: hashedPassword,
                role,
            };

            this.repository
                .insertUser(user)
                .then(() => {
                    const token = jwt.sign({ id: user.userName }, config.get('secret'), {
                        expiresIn: 86400,
                    });

                    resolve({ token: token });
                })
                .catch(error => reject(error));
        });
    }

    login({ userName, password }) {
        return new Promise((resolve, reject) => {
            this.repository
                .findUser(userName)
                .then(userInfo => {
                    if (!userInfo) {
                        throw new NotFoundHttpError('User not found');
                    }

                    const passwordIsValid = bcrypt.compareSync(password, userInfo.password);

                    if (!passwordIsValid) {
                        throw new BadRequestError();
                    }

                    const token = jwt.sign({ id: userInfo.login }, config.get('secret'), {
                        expiresIn: 86400,
                    });
                    resolve({ token: token });
                })
                .catch(error => reject(error));
        });
    }
}

module.exports = UserService;

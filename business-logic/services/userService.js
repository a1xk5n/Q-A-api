'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../configuration');

const UserRepository = require('../../data-access/repositories/userRepository');

const NotFoundHttpError = require('../../web-api/errorHandlers/httpErrors/notFoundError');
const UnauthorizedError = require('../../web-api/errorHandlers/httpErrors/unauthorizedError');

class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    register({ login, password, role = 'user' }) {
        return new Promise((resolve, reject) => {
            const hashedPassword = bcrypt.hashSync(password, 8);

            const user = {
                login,
                password: hashedPassword,
                role,
            };

            this.repository
                .findUser(login)
                .then(info => {
                    if (info) {
                        throw new BadRequest();
                    }
                    return this.repository.insertUser(user);
                })
                .then(userInfo => {
                    const token = jwt.sign(
                        { id: userInfo.id, login: userInfo.login, role: userInfo.role },
                        config.get('secret'),
                        {
                            expiresIn: 900,
                        },
                    );

                    resolve({ token: token });
                })
                .catch(error => reject(error));
        });
    }

    login({ login, password }) {
        return new Promise((resolve, reject) => {
            this.repository
                .findUser(login)
                .then(userInfo => {
                    if (!userInfo) {
                        throw new NotFoundHttpError();
                    }

                    const passwordIsValid = bcrypt.compareSync(password, userInfo.password);

                    if (!passwordIsValid) {
                        throw new UnauthorizedError();
                    }

                    const token = jwt.sign(
                        { id: userInfo.id, login: userInfo.login, role: userInfo.role },
                        config.get('secret'),
                        {
                            expiresIn: 900,
                        },
                    );

                    resolve({ token: token });
                })
                .catch(error => reject(error));
        });
    }
}

module.exports = UserService;

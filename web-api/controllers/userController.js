'use strict';

const express = require('express');
const UserService = require('../../business-logic/services/userService');

class UserController {
    constructor() {
        this._router = express.Router();
        this._service = new UserService();
        this._registerRoutes(this._router);
    }

    register(req, res, next) {
        this._service
            .register(req.body)
            .then(({ token }) => {
                res.cookie('Autorization', token);
                res.send({ auth: true });
            })
            .catch(error => {
                return next(error);
            });
    }

    login(req, res, next) {
        this._service
            .login(req.body)
            .then(({ token }) => {
                res.cookie('Autorization', token);
                res.send({ auth: true });
            })
            .catch(error => {
                return next(error);
            });
    }

    logout(req, res, next) {
        res.clearCookie('Autorization');
        res.send({ auth: false });
    }

    _registerRoutes(router) {
        router.post('/register', this.register.bind(this));
        router.post('/login', this.login.bind(this));
        router.get('/logout', this.logout.bind(this));
    }

    get Router() {
        return this._router;
    }
}

module.exports = UserController;

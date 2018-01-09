'use strict';

const express = require('express');

class BaseController {
    constructor(Service) {
        this._router = express.Router();
        this._service = new Service();
        this._registerRoutes(this._router);
    }

    getAll(req, res, next) {
        this._service
            .getAll()
            .then(tags => {
                res.send(tags);
            })
            .catch(error => {
                return next(error);
            });
    }

    create(req, res, next) {
        this._service
            .create(req.body)
            .then(info => {
                res.send(info);
            })
            .catch(error => {
                return next(error);
            });
    }

    update(req, res, next) {
        this._service
            .update(req.body)
            .then(info => {
                res.send(info);
            })
            .catch(error => {
                return next(error);
            });
    }

    delete(req, res, next) {
        this._service
            .delete(req.body)
            .then(() => {
                res.send({ info: 'deleted' });
            })
            .catch(error => {
                return next(error);
            });
    }

    get Router() {
        return this._router;
    }
}

module.exports = BaseController;

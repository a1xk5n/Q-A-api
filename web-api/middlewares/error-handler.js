'use strict';

const express = require('express');
const BaseMiddleware = require('./base');
const HttpError = require('../errorHandlers/httpErrors/httpError');
const NotFoundHttpError = require('../errorHandlers/httpErrors/notFoundError');

class ErrorHandlerMiddleware extends BaseMiddleware {
    _registerMiddlewares() {
        this.Router.use(this._handleNotFound);
    }

    _handleNotFound(req, res, next) {
        let error = new NotFoundHttpError();
        return next(error);
    }

    _handleError(err, req, res, next) {
        // Logger.error(err);
        let response = {};
        if (typeof err === 'HttpError') {
            response = err.Serialize();
        } else {
            response = {
                message: err.Message,
            };
        }
        res.status(err.StatusCode || 500).send(response);
    }

    RegisterErrorHandlers(app) {
        app.use(this._handleError);
    }
}

module.exports = ErrorHandlerMiddleware;

'use strict';

const HttpError = require('./httpError');

class BadRequestHttpError extends HttpError {
    constructor() {
        super(400, 'Bad Request');
    }
}

module.exports = BadRequestHttpError;

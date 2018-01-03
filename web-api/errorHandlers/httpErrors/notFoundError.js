'use strict';

const HttpError = require('./httpError');

class NotFoundHttpError extends HttpError {
    constructor(text = 'Not Found') {
        super(404, text);
    }
}

module.exports = NotFoundHttpError;

'use strict';

const HttpError = require('./httpError');

class NotFoundHttpError extends HttpError {
	constructor() {
		super(404, 'Not Found');
	}
}

module.exports = NotFoundHttpError;

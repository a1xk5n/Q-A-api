'use strict';

const HttpError = require('./httpError');

class ForbiddenHttpError extends HttpError {
	constructor() {
		super(403, 'Forbidden');
	}
}

module.exports = ForbiddenHttpError;

'use strict';

const HttpError = require('./httpError');

class UnauthorizedHttpError extends HttpError {
	constructor() {
		super(401, 'Unauthorized');
	}
}

module.exports = UnauthorizedHttpError;

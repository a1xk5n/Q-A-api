'use strict';

const express = require('express');

class BaseMiddleware{
	constructor() {
		this._router = express.Router();
		this._registerMiddlewares();
	}

	get Router() {
		return this._router;
	}
}

module.exports = BaseMiddleware;

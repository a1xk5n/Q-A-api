'use strict';

class HttpError {
	constructor(statusCode, message){
		this._message = message;
		this._statusCode = statusCode;
	}

	get Message() {
		return this._message;
	}

	get StatusCode() {
		return this._statusCode;
	}

	Serialize() {
		let serializedObject = {
			message: this.Message
		}

		return JSON.stringify(serializedObject)
	}
}

module.exports = HttpError;

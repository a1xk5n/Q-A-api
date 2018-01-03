'use strict';

const mongoose = require('mongoose');
const config = require('../configuration');

const DatabaseService = {
    connect () {
        return mongoose.connect(config.get('mongooseUri'));
    }
}

module.exports = DatabaseService;

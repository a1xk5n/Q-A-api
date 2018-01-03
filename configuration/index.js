'use strict';

const nconf = require('nconf');
const path = require('path');

const pathToConfig = path.resolve(__dirname, 'config.json')
nconf.argv().env().file({file: pathToConfig});

module.exports = nconf;

'use strict';

const http = require('http');
const config = require('./configuration');
const Application = require('./web-api/app');
const logger = require('./shared/logger');

class Server {
    constructor() {
        this._app = new Application(config);
        this._server = http.Server(this._app.ExpressApp);
    }

    startServer() {
        this._server.listen(process.env.PORT || config.get('port'), () => {
            logger.info('Application is listening on port ' + process.env.PORT || config.get('port'));
        });
    }
}

const server = new Server();
server.startServer();

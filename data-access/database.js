'use strict';

const pg = require('pg');
const config = require('../configuration');

class DatabaseService {
    constructor() {
        this.pool = new pg.Pool({
            connectionString: config.get('postgresUri'),
        });

        // const pool = new pg.Pool({
        //     user: 'klhfgkjkjtpxkq',
        //     host: 'ec2-54-235-148-19.compute-1.amazonaws.com',
        //     database: 'dajjuegsva6vv2',
        //     password: 'b77a05eb0ff4764ae76130b6e515e82896f47f4300bbeebe826b6328c972a066',
        //     port: 5432,
        //     ssl: true,
        // });
    }

    getPool() {
        return this.pool;
    }
}

module.exports = new DatabaseService();

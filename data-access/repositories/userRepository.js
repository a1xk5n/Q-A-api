const db = require('../database');

const BadRequest = require('../../web-api/errorHandlers/httpErrors/badRequest');

class UserRepository {
    constructor() {
        this.pool = db.getPool();
    }

    insertUser({ userName, password, role }) {
        return new Promise((resolve, reject) => {
            this.findUser(userName).then(info => {
                if (info) {
                    reject(new BadRequest());
                } else {
                    this.pool.query(
                        `INSERT INTO users (login, password, role) VALUES ('${userName}', '${password}', '${role}')`,
                        (err, res) => {
                            if (err) {
                                reject(err);
                            }
                            this.findUser(userName)
                                .then(info => resolve(info))
                                .catch(err => reject(err));
                        },
                    );
                }
            });
        });
    }

    findUser(userName) {
        return new Promise((resolve, reject) => {
            this.pool.query(`SELECT * FROM users WHERE login='${userName}'`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
            });
        });
    }
}

module.exports = UserRepository;

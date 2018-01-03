const db = require('../database');

class UserRepository {
    constructor() {
        this.pool = db.getPool();
    }

    insertUser({ userName, password, role }) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `INSERT INTO users (login, password, role) VALUES ('${userName}', '${password}', '${role}')`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                },
            );
        });
    }

    findUser(userName) {
        return new Promise((resolve, reject) => {
            this.pool.query(`SELECT * FROM users where login='${userName}'`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
            });
        });
    }
}

module.exports = UserRepository;

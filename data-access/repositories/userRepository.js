const db = require('../database');

class UserRepository {
    constructor() {
        this.pool = db.getPool();
    }

    insertUser({ login, password, role }) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `INSERT INTO users (login, password, role) VALUES ('${login}', '${password}', '${role}') returning *`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res.rows[0]);
                },
            );
        });
    }

    findUser(login) {
        return new Promise((resolve, reject) => {
            this.pool.query(`SELECT * FROM users WHERE login='${login}'`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
            });
        });
    }
}

module.exports = UserRepository;

const db = require('../database');

const BadRequest = require('../../web-api/errorHandlers/httpErrors/badRequest');
const QuestionsQueries = require('../queries/questionsQueries');

class QuestionsRepository {
    constructor() {
        this.pool = db.getPool();
    }

    getAnswer(id) {
        return new Promise((resolve, reject) => {
            this.pool.query(`SELECT * FROM answers WHERE id='${id}'`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
            });
        });
    }

    createAnswer(userId, questionId, text) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `insert into answers (user_id, question_id, text, date_of_create, date_of_update)
            values (${userId}, '${questionId}', '${text}', now(), now()) returning id`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res.rows[0].id);
                },
            );
        });
    }

    updateAnswer(answerId, text) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `update answers set text='${text}',date_of_update=NOW()  where id='${answerId}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                },
            );
        });
    }

    deleteAnswer(answerId) {
        return new Promise((resolve, reject) => {
            this.pool.query(`delete from answers where id='${answerId}'`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    getUserVoteStatus(userId, answerId) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `select * from answer_rating where user_id='${userId}' and answer_id='${answerId}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res.rows[0]);
                },
            );
        });
    }

    createVoteStatus(userId, answerId, status) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `insert into answer_rating (user_id, answer_id, status) values ('${userId}', '${answerId}', '${status}')`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                },
            );
        });
    }

    updateVoteStatus(userId, answerId, status) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `update answer_rating set status='${status}' where user_id='${userId}' and answer_id='${answerId}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                },
            );
        });
    }

    deleteVoteStatus(userId, answerId) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `delete from answer_rating where user_id='${userId}' and answer_id='${answerId}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                },
            );
        });
    }
}

module.exports = QuestionsRepository;

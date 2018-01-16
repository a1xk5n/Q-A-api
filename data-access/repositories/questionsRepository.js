const db = require('../database');

const BadRequest = require('../../web-api/errorHandlers/httpErrors/badRequest');
const QuestionsQueries = require('../queries/questionsQueries');

class QuestionsRepository {
    constructor() {
        this.pool = db.getPool();
    }

    getAll(userId) {
        return new Promise((resolve, reject) => {
            const query = QuestionsQueries.getAllQuestions(userId);

            this.pool.query(query, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows);
            });
        });
    }

    getFilteredByTags(userId, tags) {
        return new Promise((resolve, reject) => {
            const query = QuestionsQueries.getQuestionsFilteredByTags(userId, tags);

            this.pool.query(query, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows);
            });
        });
    }

    findQuestion(title) {
        return new Promise((resolve, reject) => {
            this.pool.query(`SELECT * FROM questions WHERE title='${title}'`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
            });
        });
    }

    createQuestion(userId, title, description) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `insert into questions (user_id, title, description, date_of_create, date_of_update)
            values (${userId}, '${title}', '${description}', now(), now()) returning id`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res.rows[0].id);
                },
            );
        });
    }

    updateQuestionTagsMapper(questionId, tags) {
        return new Promise((resolve, reject) => {
            const query = QuestionsQueries.getQueryForUpdateQuestionsTagsMapper(questionId, tags);
            this.pool.query(query, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(questionId);
            });
        });
    }

    getQuestionWithAnswers(userId, questionId) {
        return new Promise((resolve, reject) => {
            const query = QuestionsQueries.getQueryForQuestionWithAnswers(userId, questionId);
            this.pool.query(query, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
            });
        });
    }

    deleteQuestion(questionId) {
        return new Promise((resolve, reject) => {
            this.pool.query(`delete from questions where id=${questionId}`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    deleteQuestionTagMapperInfo(questionId) {
        return new Promise((resolve, reject) => {
            this.pool.query(`delete from question_tag_mapper where question_id=${questionId}`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    updateQuestion(questionId, title, description) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `update questions set title='${title}',description='${description}', date_of_update=NOW() where id=${questionId}`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                },
            );
        });
    }

    getUserVoteStatus(userId, questionId) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `select * from question_rating where user_id='${userId}' and question_id='${questionId}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res.rows[0]);
                },
            );
        });
    }

    createVoteStatus(userId, questionId, status) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `insert into question_rating (user_id, question_id, status) values ('${userId}', '${questionId}', '${status}')`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                },
            );
        });
    }

    updateVoteStatus(userId, questionId, status) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `update question_rating set status='${status}' where user_id='${userId}' and question_id='${questionId}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                },
            );
        });
    }

    deleteVoteStatus(userId, questionId) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                `delete from question_rating where user_id='${userId}' and question_id='${questionId}'`,
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

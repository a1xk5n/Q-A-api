const db = require('../database');

const BadRequest = require('../../web-api/errorHandlers/httpErrors/badRequest');

class TagsRepository {
    constructor() {
        this.pool = db.getPool();
    }

    createTag(tagName) {
        return new Promise((resolve, reject) => {
            this.findTag(tagName).then(info => {
                if (info) {
                    reject(new BadRequest());
                } else {
                    this.pool.query(`INSERT INTO tags (tag_name) VALUES ('${tagName}')`, (err, res) => {
                        if (err) {
                            reject(err);
                        }
                        this.findTag(tagName)
                            .then(info => resolve(info))
                            .catch(err => reject(err));
                    });
                }
            });
        });
    }

    findTag(tagName) {
        return new Promise((resolve, reject) => {
            this.pool.query(`SELECT * FROM tags WHERE tag_name='${tagName}'`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
            });
        });
    }

    findTagById(id) {
        return new Promise((resolve, reject) => {
            this.pool.query(`SELECT * FROM tags WHERE id='${id}'`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
            });
        });
    }

    deleteTag(tagId) {
        return new Promise((resolve, reject) => {
            this.findTagById(tagId).then(info => {
                if (!info) {
                    reject(new BadRequest());
                } else {
                    this.pool.query(`DELETE FROM tags where id='${tagId}'`, (err, res) => {
                        if (err) {
                            reject(err);
                        }

                        resolve();
                    });
                }
            });
        });
    }

    updateTag(tagId, newTagName) {
        return new Promise((resolve, reject) => {
            this.findTagById(tagId).then(info => {
                if (!info) {
                    reject(new BadRequest());
                } else {
                    this.pool.query(`update tags set tag_name='${newTagName}' where id=${tagId}`, (err, res) => {
                        if (err) {
                            reject(err);
                        }
                        this.findTagById(tagId)
                            .then(info => resolve(info))
                            .catch(err => reject(err));
                    });
                }
            });
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.pool.query(`SELECT * FROM tags`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows);
            });
        });
    }
}

module.exports = TagsRepository;

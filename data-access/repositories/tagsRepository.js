const db = require('../database');

class TagsRepository {
    constructor() {
        this.pool = db.getPool();
    }

    createTag(tagName) {
        return new Promise((resolve, reject) => {
            this.pool.query(`INSERT INTO tags (tag_name) VALUES ('${tagName}') returning *`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
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
            this.pool.query(`DELETE FROM tags where id='${tagId}'`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    updateTag(tagId, newTagName) {
        return new Promise((resolve, reject) => {
            this.pool.query(`update tags set tag_name='${newTagName}' where id=${tagId} returning *`, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
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

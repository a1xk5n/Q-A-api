'use strict';

const TagsRepository = require('../../data-access/repositories/tagsRepository');

const NotFoundHttpError = require('../../web-api/errorHandlers/httpErrors/notFoundError');
const BadRequest = require('../../web-api/errorHandlers/httpErrors/badRequest');

class TagsService {
    constructor() {
        this.repository = new TagsRepository();
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.repository
                .getAll()
                .then(tags => {
                    resolve(tags);
                })
                .catch(error => reject(error));
        });
    }

    create({ tagName }) {
        return new Promise((resolve, reject) => {
            this.repository
                .findTag(tagName)
                .then(info => {
                    if (info) {
                        throw new BadRequest();
                    }
                    return this.repository.createTag(tagName);
                })
                .then(tagInfo => {
                    resolve({ tagId: tagInfo.id, tagName: tagInfo.tag_name });
                })
                .catch(error => reject(error));
        });
    }

    delete({ tagId }) {
        return new Promise((resolve, reject) => {
            this.repository
                .findTagById(tagId)
                .then(info => {
                    if (!info) {
                        throw new BadRequest();
                    }
                    this.repository.deleteTag(tagId);
                })
                .then(() => {
                    resolve();
                })
                .catch(error => reject(error));
        });
    }

    update({ tagId, tagName }) {
        return new Promise((resolve, reject) => {
            this.repository
                .findTagById(tagId)
                .then(info => {
                    if (!info) {
                        throw new BadRequest();
                    }
                    return this.repository.updateTag(tagId, tagName);
                })
                .then(tagInfo => {
                    resolve({ tagId: tagInfo.id, tagName: tagInfo.tag_name });
                })
                .catch(error => reject(error));
        });
    }
}

module.exports = TagsService;

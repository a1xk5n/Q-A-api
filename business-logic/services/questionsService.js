const QuestionsRepository = require('../../data-access/repositories/questionsRepository');

const NotFoundHttpError = require('../../web-api/errorHandlers/httpErrors/notFoundError');
const BadRequest = require('../../web-api/errorHandlers/httpErrors/badRequest');
const ForbiddenError = require('../../web-api/errorHandlers/httpErrors/forbiddenError');

class QuestionsService {
    constructor() {
        this.repository = new QuestionsRepository();
    }

    getAll(userId) {
        return new Promise((resolve, reject) => {
            this.repository
                .getAll(userId)
                .then(questions => {
                    resolve(questions);
                })
                .catch(error => reject(error));
        });
    }

    getFilteredByTags(userId, tags) {
        return new Promise((resolve, reject) => {
            this.repository
                .getFilteredByTags(userId, tags)
                .then(questions => {
                    resolve(questions);
                })
                .catch(error => reject(error));
        });
    }

    create({ title, description, tags }, { userId }) {
        return new Promise((resolve, reject) => {
            this.repository
                .findQuestion(title)
                .then(info => {
                    if (info || !tags) {
                        throw new BadRequest();
                    }
                    return this.repository.createQuestion(userId, title, description);
                })
                .then(questionId => this.repository.updateQuestionTagsMapper(questionId, tags))
                .then(questionId => this.repository.getQuestionWithAnswers(userId, questionId))
                .then(info => {
                    resolve(info);
                })
                .catch(error => reject(error));
        });
    }

    delete({ questionId }, { userId, isAdmin }) {
        return new Promise((resolve, reject) => {
            this.repository
                .getQuestionWithAnswers(userId, questionId)
                .then(info => {
                    if (!info) {
                        throw new BadRequest();
                    }
                    if (!isAdmin && userId !== info.user_id) {
                        throw new ForbiddenError();
                    }

                    this.repository.deleteQuestion(questionId);
                    resolve();
                })
                .catch(error => reject(error));
        });
    }

    updateQuestionTags({ questionId, tags }, { userId, isAdmin }) {
        return new Promise((resolve, reject) => {
            this.repository
                .getQuestionWithAnswers(userId, questionId)
                .then(info => {
                    if (!info) {
                        throw new BadRequest();
                    }
                    if (!isAdmin && userId !== info.user_id) {
                        throw new ForbiddenError();
                    }
                    return this.repository.deleteQuestionTagMapperInfo(questionId);
                })
                .then(() => this.repository.updateQuestionTagsMapper(questionId, tags))
                .then(() => this.repository.getQuestionWithAnswers(userId, questionId))
                .then(info => {
                    resolve(info);
                })
                .catch(error => reject(error));
        });
    }

    update({ questionId, title, description }, { userId, isAdmin }) {
        return new Promise((resolve, reject) => {
            this.repository
                .getQuestionWithAnswers(userId, questionId)
                .then(info => {
                    if (!info) {
                        throw new BadRequest();
                    }
                    if (!isAdmin && userId !== info.user_id) {
                        throw new ForbiddenError();
                    }
                    return this.repository.updateQuestion(questionId, title, description);
                })
                .then(() => this.repository.getQuestionWithAnswers(userId, questionId))
                .then(info => {
                    resolve(info);
                })
                .catch(error => reject(error));
        });
    }

    setUserStatus({ questionId, status }, { userId }) {
        return new Promise((resolve, reject) => {
            this.repository
                .getUserVoteStatus(userId, questionId)
                .then(info => {
                    if (!status && info) {
                        return this.repository.deleteVoteStatus(userId, questionId);
                    }
                    if (info) {
                        return this.repository.updateVoteStatus(userId, questionId, status);
                    }
                    return this.repository.createVoteStatus(userId, questionId, status);
                })
                .then(info => {
                    resolve(info);
                })
                .catch(error => reject(error));
        });
    }

    getById(questionId, userId) {
        return new Promise((resolve, reject) => {
            this.repository
                .getQuestionWithAnswers(userId, questionId)
                .then(info => {
                    if (!info) {
                        throw new BadRequest();
                    }
                    resolve(info);
                })
                .catch(error => reject(error));
        });
    }
}

module.exports = QuestionsService;

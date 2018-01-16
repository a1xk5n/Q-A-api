const AnswersRepository = require('../../data-access/repositories/answersRepository');

const NotFoundHttpError = require('../../web-api/errorHandlers/httpErrors/notFoundError');
const BadRequest = require('../../web-api/errorHandlers/httpErrors/badRequest');
const ForbiddenError = require('../../web-api/errorHandlers/httpErrors/forbiddenError');

class QuestionsService {
    constructor() {
        this.repository = new AnswersRepository();
    }

    create({ text, questionId }, { userId }) {
        return new Promise((resolve, reject) => {
            this.repository
                .createAnswer(userId, questionId, text)
                .then(answerId => this.repository.getAnswer(answerId))
                .then(info => {
                    resolve(info);
                })
                .catch(error => reject(error));
        });
    }

    delete({ questionId, answerId }, { userId, isAdmin }) {
        return new Promise((resolve, reject) => {
            this.repository
                .getAnswer(answerId)
                .then(info => {
                    if (!info) {
                        throw new BadRequest();
                    }
                    if (!isAdmin && userId !== info.user_id) {
                        throw new ForbiddenError();
                    }

                    this.repository.deleteAnswer(answerId);
                    resolve();
                })
                .catch(error => reject(error));
        });
    }

    update({ questionId, answerId, text }, { userId, isAdmin }) {
        return new Promise((resolve, reject) => {
            this.repository
                .getAnswer(answerId)
                .then(info => {
                    if (!info) {
                        throw new BadRequest();
                    }
                    if (!isAdmin && userId !== info.user_id) {
                        throw new ForbiddenError();
                    }
                    return this.repository.updateAnswer(answerId, text);
                })
                .then(() => this.repository.getAnswer(answerId))
                .then(info => {
                    resolve(info);
                })
                .catch(error => reject(error));
        });
    }

    setUserStatus({ answerId, status }, { userId }) {
        return new Promise((resolve, reject) => {
            this.repository
                .getUserVoteStatus(userId, answerId)
                .then(info => {
                    if (!status && info) {
                        return this.repository.deleteVoteStatus(userId, answerId);
                    }
                    if (info) {
                        return this.repository.updateVoteStatus(userId, answerId, status);
                    }
                    return this.repository.createVoteStatus(userId, answerId, status);
                })
                .then(() => {
                    resolve({
                        info: 'status updated',
                    });
                })
                .catch(error => reject(error));
        });
    }
}

module.exports = QuestionsService;

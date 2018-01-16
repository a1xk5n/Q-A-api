'use strict';

const express = require('express');
const QuestionsService = require('../../business-logic/services/questionsService');
const BaseController = require('./baseController');

const authMiddleware = require('../middlewares/authMiddleware');
const isAuthorized = require('../middlewares/isAuthorized');

class QuestionsController extends BaseController {
    constructor() {
        super(QuestionsService);
    }

    getAll(req, res, next) {
        const currentUserId = req.decodedInfo ? req.decodedInfo.userId : null;

        this._service
            .getAll(currentUserId)
            .then(info => {
                res.send(info);
            })
            .catch(error => {
                return next(error);
            });
    }

    getFilteredByTags(req, res, next) {
        const currentUserId = req.decodedInfo ? req.decodedInfo.userId : null;

        this._service
            .getFilteredByTags(currentUserId, req.body.tags)
            .then(info => {
                res.send(info);
            })
            .catch(error => {
                return next(error);
            });
    }

    updateQuestionTags(req, res, next) {
        this._service
            .updateQuestionTags(req.body, req.decodedInfo)
            .then(info => {
                res.send(info);
            })
            .catch(error => {
                return next(error);
            });
    }

    setUserStatus(req, res, next) {
        this._service
            .setUserStatus(req.body, req.decodedInfo)
            .then(info => {
                res.send(info);
            })
            .catch(error => {
                return next(error);
            });
    }

    getById(req, res, next) {
        const currentUserId = req.decodedInfo ? req.decodedInfo.userId : null;

        this._service
            .getById(req.params.questionId, currentUserId)
            .then(info => {
                res.send(info);
            })
            .catch(error => {
                return next(error);
            });
    }

    _registerRoutes(router) {
        router.get('/', isAuthorized, this.getAll.bind(this));
        router.get('/:questionId', isAuthorized, this.getById.bind(this));
        router.post('/getFilteredByTags', isAuthorized, this.getFilteredByTags.bind(this));
        router.post('/', authMiddleware, this.create.bind(this));
        router.post('/setUserStatus', authMiddleware, this.setUserStatus.bind(this));
        router.put('/updateTags', authMiddleware, this.updateQuestionTags.bind(this));
        router.put('/', authMiddleware, this.update.bind(this));
        router.delete('/', authMiddleware, this.delete.bind(this));
    }
}

module.exports = QuestionsController;

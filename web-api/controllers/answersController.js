'use strict';

const express = require('express');
const AnswersService = require('../../business-logic/services/answersService');
const BaseController = require('./baseController');

const authMiddleware = require('../middlewares/authMiddleware');

class QuestionsController extends BaseController {
    constructor() {
        super(AnswersService);
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

    _registerRoutes(router) {
        router.post('/', authMiddleware, this.create.bind(this));
        router.post('/setUserStatus', authMiddleware, this.setUserStatus.bind(this));
        router.put('/', authMiddleware, this.update.bind(this));
        router.delete('/', authMiddleware, this.delete.bind(this));
    }
}

module.exports = QuestionsController;

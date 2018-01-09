'use strict';

const express = require('express');
const TagsService = require('../../business-logic/services/tagsService');
const BaseController = require('./baseController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

class TagsController extends BaseController {
    constructor() {
        super(TagsService);
    }

    _registerRoutes(router) {
        router.get('/', this.getAll.bind(this));
        router.post('/', authMiddleware, adminMiddleware, this.create.bind(this));
        router.put('/', authMiddleware, adminMiddleware, this.update.bind(this));
        router.delete('/', authMiddleware, adminMiddleware, this.delete.bind(this));
    }
}

module.exports = TagsController;

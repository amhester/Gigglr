"use strict";


var bunyan = require('bunyan');
var appConfig = require('./../app.config.json');
var database = require('../services/database.js');
var User = require('../models/user.js');
var Content = require('../models/content.js');


module.exports.register = function (server) {
    server.post('/user/:q', function (req, res, next) {
        new User().create(req, res, next);
    });
    server.post('/requestBuddy/:q', function (req, res, next) {
        new User().sendFriendRequest(req, res, next);
    });
    server.post('/acceptBuddy/:q', function (req, res, next) {
        new User().approveFriendRequest(req, res, next);
    });
    server.post('/content/:q', function (req, res, next) {
        new Content().create(req, res, next);
    });
    server.post('/vote/:q', function (req, res, next) {
        new Content.vote(req, res, next);
    });
    server.post('/shareContent/:q', function (req, res, next) {
        new Content().share(req, res, next);
    });
    server.get('/userById/:q', function (req, res, next) {
        new User().getById(req, res, next);
    });
    server.get('/userByName/:q', function (req, res, next) {
        new User().getByName(req, res, next);
    });
    server.get('/userByEmail/:q', function (req, res, next) {
        new User().getByEmailAddress(req, res, next);
    });
    server.get('/getBuddies/:q', function (req, res, next) {
        new User().getFriends(req, res, next);
    });
    server.get('/getUserContent/:q', function (req, res, next) {
        new Content().getByUserId(req, res, next);
    });
    server.get('/getContentById/:q', function (req, res, next) {
        new Content().getById(req, res, next);
    });
};


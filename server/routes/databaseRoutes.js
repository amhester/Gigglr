"use strict";


var bunyan = require('bunyan');
var appConfig = require('./../app.config.json');
var database = require('../services/database.js');


module.exports.register = function (server) {

    var titan = new database();

    server.get('/search/:q', function (req, res, next) {
        var q = req.params.q;
        next();
    });

    server.get('/userById/:q', function (req, res, next) {
        var q = {
            query: appConfig.Queries.GetUserByUserId,
            params: { userId: req.params.q }
        };
        titan.execute(q, function (error, results) {
            if(error) {
                req.log.error('Database Error: %s', error);
                res.send(500, error);
            } else {
                res.send(200, results);
            }
        });
        next();
    });

    server.get('/userByName/:q', function (req, res, next) {
        var q = {
            query: appConfig.Queries.GetUserByUserName,
            params: { userName: req.params.q }
        };
        titan.execute(q, function (error, results) {
            if(error) {
                req.log.error('Database Error: %s', error);
                res.send(500, error);
            } else {
                res.send(200, results);
            }
        });
        next();
    });

    server.get('/getUserContent/:q', function (req, res, next) {
        var q = {
            query: appConfig.Queries.GetUserContent,
            params: { userId: req.params.q }
        };
        titan.execute(q, function (error, results) {
            if(error) {
                req.log.error('Database Error: %s', error);
                res.send(500, error);
            } else {
                res.send(200, results);
            }
        });
        next();
    });

    server.get('/userByEmail/:q', function (req, res, next) {
        var q = {
            query: appConfig.Queries.GetUserByEmailAddress,
            params: { emailAddress: req.params.q }
        };
        titan.execute(q, function (error, results) {
            if(error) {
                req.log.error('Database Error: %s', error);
                res.send(500, error);
            } else {
                res.send(200, results);
            }
        });
        next();
    });

    server.get('/getContentById/:q', function (req, res, next) {
        var q = {
            query: appConfig.Queries.GetContentById,
            params: { contentId: req.params.q }
        };
        titan.execute(q, function (error, results) {
            if(error) {
                req.log.error('Database Error: %s', error);
                res.send(500, error);
            } else {
                res.send(200, results);
            }
        });
        next();
    });

    server.post('/user/:q', function (req, res, next) {
        var q = {
            query: appConfig.Queries.InsertUser,
            params: req.params
        };
        titan.execute(q, function (error, results) {
            if(error) {
                req.log.error('Database Error: %s', error);
                res.send(500, error);
            } else {
                res.send(200, results);
            }
        });
        next();
    });

    server.post('/content/:q', function (req, res, next) {
        var q = {
            query: appConfig.Queries.InsertContent,
            params: req.params
        };
        titan.execute(q, function (error, results) {
            if(error) {
                req.log.error('Database Error: %s', error);
                res.send(500, error);
            } else {
                res.send(200, results);
            }
        });
        next();
    });

    server.post('/vote/:q', function (req, res, next) {
        var q = {
            query: appConfig.Queries.VoteContent,
            params: req.params
        };
        titan.execute(q, function (error, results) {
            if(error) {
                req.log.error('Database Error: %s', error);
                res.send(500, error);
            } else {
                res.send(200, results);
            }
        });
        next();
    });

};


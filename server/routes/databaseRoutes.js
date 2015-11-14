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

    server.post('/user/:q', function (req, res, next) {

        var q = { query: appConfig.Queries.InsertUser, params: req.params };

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


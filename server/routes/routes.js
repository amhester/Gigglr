"use strict";

var data = require('../testData.json');
var User = require('../models/user.js');
var Content = require('../models/content.js');

module.exports = {};

module.exports.register = function (server) {

    server.get('/search/:q', function (req, res, next) {
        var q = req.params.q;

        var returnData = data;
        var parsedContent = [];

        if (returnData.items){
            for (var i = 0; i < returnData.items.length; i++){
                var content = new Content();
                parsedContent.push(content.loadDataFromSearch(returnData.items[i]));
            }
        }
        for (var j = 0; j < parsedContent.length; j++){
            parsedContent[j].insert(req, res, next);
        }
        res.send(200, parsedContent.map(function (it){return it.toJson()}));
        next();
    });

};
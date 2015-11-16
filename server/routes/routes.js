"use strict";

var data = require('../testData.json');
var User = require('../models/user.js');
var Content = require('../models/content.js');
var nlp = require("natural");

module.exports = {};

module.exports.register = function (server) {

    server.get('/search/:q', function (req, res, next) {
        var q = req.params.q;
        var returnData = data;
        var parsedContent = [];

        /*TODO: Using NLP and our burned data, determine if we need to reach out to google, or if we have already
          burned things that we can load that they have not seen yet. Load them all in, if there are less than 10,
          reach out to google*/

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
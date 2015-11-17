"use strict";

var data = require('../testData.json');
var User = require('../models/user.js');
var Content = require('../models/content.js');
var Tag = require('../models/tag.js');
var nlp = require("nlp_compromise");

module.exports = {};

module.exports.register = function (server) {

    server.get('/search/:q', function (req, res, next) {
        var q = req.params.q;
        var returnData = data;
        var parsedContent = [];

        var something =  nlp.pos(q);
        var verbs = something.verbs();
        var nouns = something.nouns();
        var adjs = something.adjectives();

        var tags = [];
        if (verbs){
            for (var v = 0; v < verbs.length; v++){
                var verbConjugate = nlp.verb(verbs[v].text.toLowerCase()).conjugate();
                tags.push(new Tag('verb', verbConjugate.infinitive, [verbConjugate.infinitive, verbConjugate.present, verbConjugate.past, verbConjugate.gerund]));
            }
        }
        if (nouns){
            for (var n = 0; n < nouns.length; n++){
                var nounConjugate = nlp.noun(nouns[n].text.toLowerCase()).conjugate();
                tags.push(new Tag('noun', nounConjugate.singular, [nounConjugate.singular, nounConjugate.plural]));
            }
        }
        if (adjs){
            for (var a = 0; a < adjs.length; a++){
                var adjConjugate = nlp.adjective(adjs[a].text.toLowerCase()).conjugate();
                tags.push(new Tag('adjective', adjConjugate.adverb, [adjConjugate.comparative, adjConjugate.superlative, adjConjugate.adverb, adjConjugate.noun]));
            }
        }

        for (var t = 0; t < tags.length; t++){
            tags[t].insert(req, res, next);
        }

        if (returnData.items){
            for (var i = 0; i < returnData.items.length; i++){
                var content = new Content();
                parsedContent.push(content.loadDataFromSearch(returnData.items[i]));
            }
        }

        new Content().insertOrGetAll(parsedContent, req, res, next);
    });

};
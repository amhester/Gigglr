"use strict";

var data = require('../testData.json');
var User = require('../models/user.js');
var Content = require('../models/content.js');
var Tag = require('../models/tag.js');
var nlp = require("nlp_compromise")

module.exports = {};

module.exports.register = function (server) {

    server.get('/search/:q', function (req, res, next) {
        var q = req.params.q;
        var returnData = data;
        var parsedContent = [];

        /*TODO: Using NLP and our burned data, determine if we need to reach out to google, or if we have already
          burned things that we can load that they have not seen yet. Load them all in, if ther are less than 10,
          reach out to google*/

        var something =  nlp.pos(q);
        console.log(something.text());

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

        for (var j = 0; j < parsedContent.length; j++){
            parsedContent[j].insert(req, res, next);
        }

        res.send(200, parsedContent.map(function (it){return it.toJson()}));
        next();
    });

};
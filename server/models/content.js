"use strict";

var appConfig = require('./../app.config.json');
var BaseModel = require('./baseModel.js');

var id = Symbol();
var type = Symbol();
var displayData = Symbol();
var extraContent = Symbol();
var externalLink = Symbol();

 class Content extends BaseModel{

    constructor(inId, inType, inDisplayData, inExtraContent, inExternalLink) {
        super();
        this[id] = inId;
        this[type] = inType;
        this[displayData] = inDisplayData;
        this[extraContent] = inExtraContent;
        this[externalLink] = inExternalLink;
    }

     get id() {
         return this[id];
     }
     set id(value) {
         this[id] = value;
     }

     get type() {
         return this[type];
     }
     set type(value) {
         this[type] = value;
     }

     set displayData(value) {
         this[displayData] = value;
     }
     get displayData() {
         return this[displayData];
     }

     get extraContent() {
         return this[extraContent];
     }
     set extraContent(value) {
         this[extraContent] = value;
     }

     get externalLink() {
         return this[externalLink];
     }
     set externalLink(value) {
         this[externalLink] = value;
     }

     create(req, res, next, callback){
         var q = {
             query: appConfig.Queries.InsertContent,
             params: req.params
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     vote(req, res, next, callback){
         var q = {
             query: appConfig.Queries.VoteContent,
             params: req.params
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     share(req, res, next, callback){
         var q = {
             query: appConfig.Queries.ShareContent,
             params: req.params
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     getByUserId(req, res, next, callback){
         var q = {
             query: appConfig.Queries.GetUserContent,
             params: { userId: req.params.q }
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     getById(req, res, next, callback){
         var q = {
             query: appConfig.Queries.GetContentById,
             params: { contentId: req.params.q }
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

    toJson(){
        return {
            id: this[id],
            type: this[type],
            displayData: this[displayData],
            extraContent: this[extraContent],
            externalLink: this[externalLink],
        }
    }

    parseResult(error, results, res, req, next, callback){
        var returnObject = {};
        returnObject.models = [];
        for (var i = 0; i < results.length; i++){
            console.log(results);
            returnObject.models.push(new Content(
                results[i].id,
                results[i].properties.type[0].value,
                results[i].properties.displayData[0].value,
                results[i].properties.extraContent[0].value,
                results[i].properties.externalLink[0].value
            ));
        }
        returnObject.error = error;
        callback(returnObject, res, req, next);
    }
}

module.exports = Content;
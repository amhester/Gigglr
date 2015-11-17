"use strict";

var appConfig = require('./../app.config.json');
var BaseModel = require('./baseTag.js');

var varieties = Symbol();
var title = Symbol();
var id = Symbol();
var type = Symbol();


 class Tag extends BaseModel{

    constructor(inType, inTitle, inVarieties, inId) {
        super();
        this[id] = inId;
        this[title] = inTitle;
        this[type] = inType;
        this[varieties] = inVarieties;
    }

     get varieties() {
         return this[varieties];
     }
     set varieties(value) {
         this[varieties] = value;
     }

     get id() {
         return this[id];
     }
     set id(value) {
         this[id] = value;
     }

     get title() {
         return this[title];
     }
     set title(value) {
         this[title] = value;
     }

     get type() {
         return this[type];
     }
     set type(value) {
         this[type] = value;
     }


     insert(req, res, next){
         var q = {
             query: appConfig.Queries.InsertTag,
             params: this.toDataInsertJson()
         };
         this.executeBaseQuery(q, req, res, next, function () {});
     }

     toDataInsertJson(){
        return {
            type: this[type],
            title: this[title],
            varieties: this[varieties].join(',')
        }
    }

     toJson(){
         return {
             id: this[id],
             title: this[title],
             type: this[type],
             varieties: this[varieties]
         }
     }

     getAll(req, res, next, callback){
         var q = {
             query: appConfig.Queries.GetAllTags,
             params: { contentId: req.params.q }
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }


    parseResult(error, results, res, req, next, callback){
        var returnObject = {};
        returnObject.models = [];
        for (var i = 0; i < results.length; i++){
            if (results[i] != null){
                returnObject.models.push(new Tag(
                    results[i].properties.tagType ? results[i].properties.tagType[0].value : '',
                    results[i].properties.title ? results[i].properties.title[0].value : '',
                    results[i].properties.varieties ? results[i].properties.varieties[0].value.split(',') : '',
                    results[i].id
                ));
            }
        }
        returnObject.error = error;
        callback(returnObject, res, req, next);
    }
}

module.exports = Tag;
"use strict";

var appConfig = require('./../app.config.json');
var BaseModel = require('./baseModel.js');

var id = Symbol();
var types = Symbol();
var title = Symbol();
var image = Symbol();
var video = Symbol();
var extraContent = Symbol();
var externalLink = Symbol();

 class Content extends BaseModel{

    constructor(inId, inTypes, inTitle, inImage, inVideo, inExternalLink, inExtraContent) {
        super();
        this[id] = inId;
        this[types] = inTypes ? inTypes.split(',') : undefined;
        this[title] = inTitle;
        this[image] = inImage;
        this[video] = inVideo;
        this[externalLink] = inExternalLink;
        this[extraContent] = inExtraContent;
    }

     get id() {
         return this[id];
     }
     set id(value) {
         this[id] = value;
     }

     get types() {
         return this[types];
     }
     set types(value) {
         this[types] = value;
     }

     get title() {
         return this[title];
     }
     set title(value) {
         this[title] = value;
     }

     set displayData(value) {
         this[displayData] = value;
     }
     get displayData() {
         return this[displayData];
     }

     get image() {
         return this[image];
     }
     set image(value) {
         this[image] = value;
     }

     get video() {
         return this[video];
     }
     set video(value) {
         this[video] = value;
     }

     get externalLink() {
         return this[externalLink];
     }
     set externalLink(value) {
         this[externalLink] = value;
     }

     get extraContent() {
         return this[extraContent];
     }
     set extraContent(value) {
         this[extraContent] = value;
     }

     insert(req, res, next){
         var q = {
             query: appConfig.Queries.InsertContent,
             params: this.toDataInsertJson()
         };
         this.executeBaseQuery(q, req, res, next);
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

     getViewedByUserId(req, res, next, callback){
         var q = {
             query: appConfig.Queries.GetViewedUserContent,
             params: { userId: req.params.q }
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     dropAll(req, res, next, callback){
         var q = {
             query: appConfig.Queries.DropAllContent,
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

     getAll(req, res, next, callback){
         var q = {
             query: appConfig.Queries.GetAllContent,
             params: { contentId: req.params.q }
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     toDataInsertJson(){
        return {
            types: this[types].join(','),
            title: this[title],
            imageLink: this[image] ? this[image].link : '',
            imageHeight: this[image] ? this[image].height : '',
            imageWidth: this[image] ? this[image].width : '',
            videoLink: this[video] ? this[video].link : '',
            videoHeight: this[video] ? this[video].height : '',
            videoWidth: this[video] ? this[video].width : '',
            externalLink: this[externalLink],
            extraContent: this[extraContent]
        }
    }

     toJson(){
         return {
             id: this[id],
             types: this[types],
             title: this[title],
             image: this[image],
             video: this[video],
             externalLink: this[externalLink],
             extraContent: this[extraContent]
         }
     }

     loadDataFromSearch(item){
         this.parseImageCriteria(item);
         this.parseVideoCriteria(item);
         this.parseBaseCriteria(item);
         return this;
     }

     parseImageCriteria(item){
         if (item.pagemap){
             if (item.pagemap.cse_thumbnail && item.pagemap.cse_thumbnail.length){
                 this[image] = {
                     link: item.pagemap.cse_thumbnail[0].src,
                     height: item.pagemap.cse_thumbnail[0].height,
                     width: item.pagemap.cse_thumbnail[0].width
                 };
             }
         }
     }

     parseVideoCriteria(item){
         if (item && item.pagemap){
             if (item.pagemap.videoobject && item.pagemap.videoobject.length){
                 this[video] = {
                     link: item.pagemap.videoobject[0].embedurl,
                     height: item.pagemap.videoobject[0].height,
                     width: item.pagemap.videoobject[0].width
                 };
             }
         }
     }

     parseBaseCriteria(item){
         this[types] = [];
         if (item){
             this[title] = item.title;
             this[externalLink] = item.link;
             this[extraContent] = item.htmlSnippet;
         }
         if (this[image]){
             this[types].push('image');
         }
         if (this[video]){
             this[types].push('video');
         }
         if (this[externalLink]){
             this[types].push('text');
         }

     }

    parseResult(error, results, res, req, next, callback){
        var returnObject = {};
        returnObject.models = [];
        for (var i = 0; i < results.length; i++){
            returnObject.models.push(new Content(
                results[i].id,
                results[i].properties.types ? results[i].properties.types.value : '',
                results[i].properties.title ? results[i].properties.title[0].value : '',
                {
                    link: results[i].properties.imageLink ? results[i].properties.imageLink[0].value : '',
                    height: results[i].properties.imageHeight ? results[i].properties.imageHeight[0].value : '',
                    width: results[i].properties.imageHeight ? results[i].properties.imageHeight[0].value : ''
                },
                {
                    link: results[i].properties.videoLink ? results[i].properties.videoLink[0].value : '',
                    height: results[i].properties.videoHeight ? results[i].properties.videoHeight[0].value : '',
                    width: results[i].properties.videoWidth ? results[i].properties.videoWidth[0].value : ''
                },
                results[i].properties.externalLink ? results[i].properties.externalLink[0].value : '',
                results[i].properties.extraContent ? results[i].properties.extraContent[0].value : ''
            ));
        }
        returnObject.error = error;
        callback(returnObject, res, req, next);
    }
}

module.exports = Content;
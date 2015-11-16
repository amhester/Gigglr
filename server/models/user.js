"use strict";

var appConfig = require('./../app.config.json');
var BaseModel = require('./baseModel.js');

var id = Symbol();
var username = Symbol();
var emailAddress = Symbol();
var password = Symbol();
var preferredSearchType = Symbol();

 class User extends BaseModel{

    constructor(inId, inUsername, inEmailAddress, inPassword, inPreferredSerachType) {
        super();
        this[id] = inId;
        this[username] = inUsername;
        this[emailAddress] = inEmailAddress;
        this[password] = inPassword;
        this[preferredSearchType] = inPreferredSerachType;
    }

     get id() {
         return this[id];
     }
     set id(value) {
         this[id] = value;
     }

     set username(value) {
         this[username] = value;
     }
     get username() {
         return this[username];
     }

     get emailAddress() {
         return this[emailAddress];
     }
     set emailAddress(value) {
         this[emailAddress] = value;
     }

     get password() {
         //decrypt
         return this[password];
     }
     set password(value) {
         //encrypt
         this[password] = value;
     }

     get preferredSearchType() {
         return this[preferredSearchType];
     }
     set preferredSearchType(value) {
         this[preferredSearchType] = value;
     }

     create(req, res, next, callback){
         var q = {
             query: appConfig.Queries.InsertUser,
             params: req.params
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     getFriends(req, res, next, callback){
         var q = {
             query: appConfig.Queries.GetBuddies,
             params: { userId: req.params.q }
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     sendFriendRequest(req, res, next, callback){
         var q = {
             query: appConfig.Queries.RequestBuddy,
             params: req.params
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     approveFriendRequest(req, res, next, callback){
         var q = {
             query: appConfig.Queries.AcceptBuddy,
             params: req.params
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     getById(req, res, next, callback){
        var q = {
            query: appConfig.Queries.GetUserByUserId,
            params: { emailAddress: req.params.q }
        };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     getByName(req, res, next, callback){
         var q = {
             query: appConfig.Queries.GetUserByUserName,
             params: { userName: req.params.q }
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

     getByEmailAddress(req, res, next, callback){
         var q = {
             query: appConfig.Queries.GetUserByEmailAddress,
             params: { emailAddress: req.params.q }
         };
         this.executeBaseQuery(q, req, res, next, callback);
     }

    toJson(){
        return {
            id: this[id],
            username: this[username],
            emailAddress: this[emailAddress],
            password: this[password],
            preferredSearchType: this[preferredSearchType]
        }
    }

    parseResult(error, results, res, req, next, callback){
        var returnObject = {};
        returnObject.models = [];
        if (!results || !results.length){
            return;
        }
        for (var i = 0; i < results.length; i++){
            returnObject.models.push(new User(
                results[i].id,
                results[i].properties.userName[0].value,
                results[i].properties.emailAddress[0].value,
                results[i].properties.password[0].value,
                results[i].properties.prefSearchType[0].value
            ));
        }
        returnObject.error = error;
        callback(returnObject, res, req, next);
    }
}

module.exports = User;
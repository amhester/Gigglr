"use strict";

var gremlin = require('gremlin-client');
var bunyan = require('bunyan');
var appConfig = require('./../app.config.json');
var log = bunyan.createLogger({name: 'com.gigglr.services.database.logger'});
var COMMIT_ME = function () { g.tx().commit(); };

class Database {

    constructor () {
        this._client = gremlin.createClient(appConfig.databasePort, appConfig.serverHost, { language: 'nashorn', session: true});
    }

    execute (q, callback, res, req, next, finalCallback) {
        var self = this;
        self._results = [];
        self._res = res;
        self._req = req;
        self._next = next;
        self._finalCallback = finalCallback;
        var queryObject = self.queryCaseStatement(q.query);

        if (!queryObject.query)
        {
            callback(createError('Invalid query object'), []);
        }

        var stream = self._client.stream(queryObject.query, q.params);

        if (queryObject.commitTransaction){
            console.log('commited');
            self._client.stream(COMMIT_ME);
        }

        stream.on('data', function(result) {
            console.log(result);
            self._results.push(result);
        });

        stream.on('end', function() {
            callback(false, self._results, self._res, self._req, self._next, self._finalCallback);
        });

        stream.on('error', function(e) {
            callback(e, [], self._res, self._req, self._next, self._finalCallback);
        });

    }

    queryCaseStatement(query){
        var buildQuery;
        var shouldCommit = false;
        switch (query){
            case appConfig.Queries.GetUserByUserName:
                buildQuery = this.getUserByUserName();
                break;
            case appConfig.Queries.GetAllContent:
                buildQuery = this.getAllContent();
                break;
            case appConfig.Queries.GetBuddies:
                buildQuery = this.getBuddies();
                break;
            case appConfig.Queries.GetContentById:
                buildQuery = this.getContentById();
                break;
            case appConfig.Queries.GetUserContent:
                buildQuery = this.getUserContent();
                break;
            case appConfig.Queries.GeViewedtUserContent:
                buildQuery = this.getViewedUserContent();
                break;
            case appConfig.Queries.RequestBuddy:
                buildQuery = this.requestBuddy();
                shouldCommit = true;
                break;
            case appConfig.Queries.AcceptBuddy:
                buildQuery = this.acceptBuddy();
                shouldCommit = true;
                break;
            case appConfig.Queries.GetUserByUserId:
                buildQuery = this.getUserById();
                break;
            case appConfig.Queries.GetUserByEmailAddress:
                buildQuery = this.getUserByEmailAddress();
                break;
            case appConfig.Queries.InsertUser:
                buildQuery = this.insertUser();
                shouldCommit = true;
                break;
            case appConfig.Queries.InsertContent:
                buildQuery = this.insertContent();
                shouldCommit = true;
                break;
            case appConfig.Queries.ShareContent:
                buildQuery = this.shareContent();
                shouldCommit = true;
                break;
            case appConfig.Queries.VoteContent:
                buildQuery = this.voteContent();
                shouldCommit = true;
                break;
            default:
                break;
        }
        return {query: buildQuery, commitTransaction: shouldCommit};
    }
    //**********************************__GETS__**********************************

    getUserByUserName(){
        var query = function () {
            g.V().has('userName', userName);
        };
        return query;
    }

    getUserByEmailAddress(){
        var query = function () {
            g.V().has('emailAddress', emailAddress);
        };
        return query;
    }

    getUserById(){
        var query = function () {
            g.V(userId);
        };
        return query;
    }

    getContentById(){
        var query = function () {
            g.V(contentId);
        };
        return query;
    }

    getAllContent(){
        var query = function () {
            g.V().hasLabel('Content');
        };
        return query;
    }

    getBuddies(){
        var query = function () {
            g.V(userId).bothE("Buddy").bothV().filter(function(it) {
                return it.get().id() != userId;
            });
        };
        return query;
    }

    getUserContent(){
        var query = function () {
            g.V(userId).hasLabel("User").outE("UserVote").inV();
        };
        return query;
    }

    getViewedUserContent(){
        var query = function () {
            g.V(userId).hasLabel("User").outE("UserVote").filter(function(it){ return it.type != 'shared' } ).inV();
        };
        return query;
    }

    //**********************************__END_GETS__******************************
    //****************************************************************************
    //**********************************__WRITES__********************************

    insertUser(){
        var query = function () {
            g.addV(org.apache.tinkerpop.gremlin.structure.T.label, 'User',
                'userName', userName,
                'password', password,
                'emailAddress', emailAddress,
                'prefSearchType', prefSearchType);
        };
        return query;
    }

    voteContent(){
        var query = function () {
            var edge = g.V(userId).next().addEdge('UserVote', g.V(contentId).next(), []);
            edge.property('type', type);
            edge;
        };
        return query;
    }

    shareContent(){
        var query = function () {
            var result = [];
            if (!g.V(buddyUserId).hasLabel('User').outE('UserVote').inV().hasNext()){
                result = g.V(buddyUserId).next().addEdge('UserVote', g.V(contentId).next(), []);
                result.property('type', 'Shared');
            }
            result;
        };
        return query;
    }

    insertContent() {
        var query = function () {
            if (!g.V().has('title', title).hasNext()){
                g.addV(org.apache.tinkerpop.gremlin.structure.T.label, 'Content',
                    'types', types,
                    'title', title,
                    'imageLink', imageLink,
                    'imageHeight', imageHeight,
                    'imageWidth', imageWidth,
                    'videoLink', videoLink,
                    'videoHeight', videoHeight,
                    'videoWidth', videoWidth,
                    'externalLink', externalLink,
                    'extraContent', extraContent);
            }
        };
        return query;
    }

    acceptBuddy(){
        var query = function () {
            var path = g.V(myUserId).hasLabel('User').inE().hasLabel('Buddy').has('Accepted', false).outV().hasLabel('User').hasId(buddyUserId).path().next();
            var result = [];
            if (path){
                result = path.get(1);
                result.property('Accepted', true);
            }
            result;
        };
        return query;
    }

    requestBuddy(){
        var query = function () {
            var existingEdge = g.V(myUserId).hasLabel('User').bothE('Buddy').bothV().hasId(buddyUserId);
            if (!existingEdge.hasNext()){
                var edge = g.V(myUserId).next().addEdge("Buddy", g.V(buddyUserId).next());
                edge.property('Accepted', false);
                edge;
            }
            else{
                existingEdge;
            }
        };
        return query;
    }
    //**********************************__END_WRITES__***************************


}

module.exports = Database;
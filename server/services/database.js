"use strict";

var gremlin = require('gremlin-client');
var bunyan = require('bunyan');
var appConfig = require('./../app.config.json');
var log = bunyan.createLogger({name: 'com.gigglr.services.database.logger'});
var nlp = require("nlp_compromise")
var COMMIT_ME = function () { g.tx().commit(); };

class Database {

    constructor () {
        if (!global.dbClient){
            global.dbClient = gremlin.createClient(appConfig.databasePort, appConfig.databaseHost, { language: 'nashorn', session: true});
        }
        this._client = global.dbClient;
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

        self._streams = [];
        if (q.params.length){
            self._resultLength = q.params.length;
            for (var s = 0; s < q.params.length; s++){
                self._streams.push(self._client.stream(queryObject.query, q.params[s]));
            }
        }
        else{
            self._resultLength = 1;
            self._streams.push(self._client.stream(queryObject.query, q.params));
        }

        if (queryObject.commitTransaction){
            self._client.stream(COMMIT_ME);
        }

        for (var counter = 0; counter < self._streams.length; counter++){
            self._streams[counter].on('data', function(result) {
                self._results.push(result);
            });

            self._streams[counter].on('end', function() {
                if (self._resultLength <= self._results.length || (self._results.length == 0 && self._resultLength == 1)){
                    console.log('returnData');
                    callback(false, self._results, self._res, self._req, self._next, self._finalCallback);
                }
            });

            self._streams[counter].on('error', function(e) {
                callback(e, [], self._res, self._req, self._next, self._finalCallback);
            });
        }


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
            case appConfig.Queries.DropAllContent:
                buildQuery = this.dropAllContent();
                shouldCommit = true;
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
            case appConfig.Queries.GetAllTags:
                buildQuery = this.getAllTags();
                break;
            case appConfig.Queries.GetContentByTag:
                buildQuery = this.getContentByTag();
                break;
            case appConfig.Queries.GetUserByEmailAddress:
                buildQuery = this.getUserByEmailAddress();
                break;
            case appConfig.Queries.InsertUser:
                buildQuery = this.insertUser();
                shouldCommit = true;
                break;
            case appConfig.Queries.InsertTag:
                buildQuery = this.insertTag();
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
            g.V().hasLabel('User').has('emailAddress', emailAddress);
        };
        return query;
    }

    getContentById(){
        var query = function () {
            g.V().hasLabel('Content').has('customId', contentId);
        };
        return query;
    }

    getAllContent(){
        var query = function () {
            g.V().hasLabel('Content')
        };
        return query;
    }

    getContentByTag(){
        var query = function () {
            g.V().hasLabel('Tag').has('title', myTitle).inE('ContentTag').outV().hasLabel('Content');
        };
        return query;
    }

    getAllTags(){
        var query = function () {
            g.V().hasLabel('Tag');
        };
        return query;
    }

    dropAllContent(){
        var query = function () {
            g.V().hasLabel('Content').drop();
        };
        return query;
    }

    getBuddies(){
        var query = function () {
            g.V().hasLabel('User').has('emailAddress', emailAddress).bothE("Buddy").bothV().filter(function(it) {
                return it.get().id() != userId;
            });
        };
        return query;
    }

    getUserContent(){
        var query = function () {
            g.V().hasLabel("User").has('emailAddress', emailAddress).outE("UserVote").inV();
        };
        return query;
    }

    getViewedUserContent(){
        var query = function () {
            g.V().hasLabel('User').has('emailAddress', emailAddress).outE("UserVote").filter(function(it){ return it.type != '2'} ).inV();
        };
        return query;
    }

    //**********************************__END_GETS__******************************
    //****************************************************************************
    //**********************************__WRITES__********************************

    insertUser(){
        var query = function () {
            if (!g.V().hasLabel('User').has('emailAddress', emailAddress).hasNext()){
                g.addV(org.apache.tinkerpop.gremlin.structure.T.label, 'User',
                    'userName', userName,
                    'password', '',
                    'emailAddress', emailAddress,
                    'prefSearchType', '');
            }
            else {
                g.V().hasLabel('User').has('emailAddress', emailAddress).next();
            }
        };
        return query;
    }

    insertTag(){
        var query = function () {
            if (!g.V().hasLabel('Tag').has('tagType', type).has('title', title).hasNext()){
                g.addV(org.apache.tinkerpop.gremlin.structure.T.label, 'Tag',
                    'title', title,
                    'tagType', type,
                    'varieties', varieties);
            }
        };
        return query;
    }

    voteContent(){
        var query = function () {
            var path = g.V().has('emailAddress', emailAddress).hasLabel('User').outE('UserVote').hasLabel('UserVote').bothV().hasLabel('Content').has('customId', contentId).path();
            if (path.hasNext()){
                var edge = path.next().get(1);
                edge.property('type', type);
                type;
            }
            else{
                var edge = g.V().has('emailAddress', emailAddress).hasLabel('User').next().addEdge('UserVote', g.V().has('customId', contentId).hasLabel('Content').next(), []);
                edge.property('type', type);
                type;
            }

        };
        return query;
    }

    shareContent(){
        var query = function () {
            var result = [];
            if (!g.V().hasLabel('User').has('emailAddresss', buddyEmailAddress).hasLabel('User').outE('UserVote').inV().hasNext()){
                result = g.V().has('emailAddress', buddyEmailAddress).hasLabel('User').addEdge('UserVote', g.V().hasLabel('Content').has('customId', contentId).next(), []);
                result.property('type', 'Shared');
            }
            result;
        };
        return query;
    }

    insertContent() {
        var query = function () {
            var edge;
            if (!g.V().has('title', title).hasNext()){
                var vertex = g.addV('customId', customId,
                    org.apache.tinkerpop.gremlin.structure.T.label, 'Content',
                    'types', types,
                    'title', title,
                    'imageLink', imageLink,
                    'imageHeight', imageHeight,
                    'imageWidth', imageWidth,
                    'videoLink', videoLink,
                    'videoHeight', videoHeight,
                    'videoWidth', videoWidth,
                    'externalLink', externalLink,
                    'extraContent', extraContent).next();
                if (vertex) {
                    var verticies = g.V().hasLabel('Tag').filter(function (it) {
                        return it.get().property('varieties').value().split(',').some(function (v) {
                            return g.V(vertex.id()).next().property('title').value().toLowerCase().indexOf(v) > -1;
                        });
                    });
                    while (verticies.hasNext()){
                        edge = vertex.addEdge("ContentTag", verticies.next(), []);
                    }
                    vertex;
                }
            }
            else
            {
                g.V().has('title', title).next();
            }

        };
        return query;
    }

    acceptBuddy(){
        var query = function () {
            var path = g.V().hasLabel('User').has('emailAddress', myEmailAddress).hasLabel('User').inE().hasLabel('Buddy').has('Accepted', false).outV().hasLabel('User').has('emailAddresss', buddyEmailAddress).path().next();
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
            var existingEdge = g.V().hasLabel('User').has('emailAddress', myEmailAddress).hasLabel('User').bothE('Buddy').bothV().hasLabel('User').has('emailAddresss', buddyEmailAddress);
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
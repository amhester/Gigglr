"use strict";

var gremlin = require('gremlin-client');
var bunyan = require('bunyan');
var appConfig = require('./../app.config.json');
var log = bunyan.createLogger({name: 'com.gigglr.services.database.logger'});
var COMMIT_ME = function () { g.tx().commit(); };

class Database {

    constructor () {
        this._client = gremlin.createClient(appConfig.databasePort, appConfig.serverHost, { language: 'nashorn', session: 'true' });
    }

    execute (q, callback) {
        var self = this;
        this._results = [];

        var queryObject = self.queryCaseStatement(q.query);

        if (!queryObject.query)
        {
            callback(createError('Invalid query object'), []);
        }

        var stream = self._client.stream(queryObject.query, q.params);

        if (queryObject.commitTransaction){
            self._client.stream(COMMIT_ME);
        }

        stream.on('data', function(result) {
            self._results.push(result);
        });

        stream.on('end', function() {
            log.info(this._results);
            callback(false, self._results);
        });

        stream.on('error', function(e) {
            callback(e, []);
        });

    }

    queryCaseStatement(query){
        var buildQuery;
        var shouldCommit = false;
        switch (query){
            case appConfig.Queries.GetUserByUserName:
                buildQuery = this.getUserByUserName();
                break;
            case appConfig.Queries.GetBuddies:
                buildQuery = this.getBuddies();
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
            g.V().has('userName', userName).next();
        };
        return query;
    }

    getUserByEmailAddress(){
        var query = function () {
            g.V().has('emailAddress', emailAddress).next();
        };
        return query;
    }

    getUserById(){
        var query = function () {
            g.V(userId).next();
        };
        return query;
    }

    getBuddies(){
        var query = function () {
            g.V(userId).bothE("Buddy").V();
        };
        return query;
    }

    //**********************************__END_GETS__******************************

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
            var edge = g.V(userId).addEdge('UserVote', g.V(contentId), []);
            edge.property('type', type);
        };
        return query;
    }

    shareContent(){
        var query = function () {
            var edge = g.V(buddyUserId).addEdge('UserVote', g.V(contentId), []);
            edge.property('type', 'Shared');
        };
        return query;
    }

    insertContent() {
        var query = function () {
            g.addV(org.apache.tinkerpop.gremlin.structure.T.label, 'Content',
                'type', type,
                'link', link,
                'innerContent', innerContent);
        };
        return query;
    }

    acceptBuddy(){
        var query = function () {
            var edge = g.V(myUserId).bothE('Buddy').as('e').bothV().retain([g.V(buddyUserId)]).back('e').next();
            edge.property('Accepted', true);
        };
        return query;
    }

    requestBuddy(){
        var query = function () {
            var edge = g.V(myUserId).next().addEdge("Buddy", g.V(buddyUserId).next());
            edge.property('Accepted', false);
        };
        return query;
    }
    //**********************************__END_WRITES__***************************


}

module.exports = Database;
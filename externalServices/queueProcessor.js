var config = require('./app.config.json');
var nats = require('nats').connect({ servers: config.queueServers });
var async = require('async');
var bunyan = require('bunyan');

/* ------------ Global Shit --------------- */
var itemSid = null;
var voteSid = null;
var itemsInProcess = [];
var votesToTally = {};
var log = bunyan.createLogger({name: 'com.queueProcessor.main'});

/* ------------ NATS Stuff------------------------ */
nats.on('error', function (err) {
    log.error(err);
});

itemSid = nats.subscribe('NewItem', function (msg) {
    let item = parseIncomingItem(msg);
    startProcessForItem(item);
});

voteSid = nats.subscribe('Vote', function (msg) {
    let vote = parseIncomingVote(msg);
    changeItemPreference(vote);
});

/* ---------- Use async's waterfall method to run processors in chain ------------------ */
function processItem(item) {
    async.waterfall([
        //used to consistently start the waterfall
        function (callback) {
            callback(null, item);
        },

        //Add wrapper functions here around all chain processes for item to go through, and make sure they pass back a promise
        function (pItem, callback) {
            //Call some chain processor here. example:
            let p = someNonExistentChainFunction(pItem);
            p.then(function (rItem) {
                callback(null, rItem);
            }).catch(function (err) {
                log.warn(err);
                callback(err);
            });
        },

        //Process chain will always end with these 3 functions (or at least should)
        //After processing, persist to database
        function (pItem, callback) {
            ///TODO: persist item to database
            let p = someDatabaseService(pItem);
            p.then(function (rItem) {
                callback(null, rItem);
            }).catch(function (err) {
                log.warn(err);
                callback(err);
            });
        },

        //Check if any favorites have been made to non-burned items, then execute favorite of that item
        function (pItem, callback) {
            let vote = votesToTally[pItem._postId];
            if(vote) {
                ///TODO: persist vote to databse
                let p = someDatabaseService(vote);
                p.then(function (res) {
                    callback(null, pItem);
                }).catch(function (err) {
                    log.warn(err);
                    callback(err);
                });
            } else {
                callback(null, pItem);
            }
        },

        //Remove item from process list and wrap up everything (Finish Him)
        function (pItem, callback) {
            removeItemFromProcess(pItem);
            callback(null, pItem);
        }

    ], function (err, pItem) {
        if(err) {
            log.warn(err);
        } else {
            log.trace(pItem);
        }
    });
}

/* ---------- Other Functions--------------------- */
function parseIncomingItem(msg) {
    var data = JSON.parse(msg);
    ///TODO: cast data as model
    return data;
}

function parseIncomingVote(msg) {
    var vote = JSON.parse(msg);
    ///TODO: cast data as model
    return vote;
}

function startProcessForItem(item) {
    itemsInProcess.push(item.id);
    processItem(item);
}

function removeItemFromProcess(item) {
    for(let i = 0; i < itemsInProcess.length; i++) {
        if(itemsInProcess[i] === item.id) {
            itemsInProcess.splice(i, 1);
        }
    }
}

function changeItemPreference(vote) {
    if(itemsInProcess.indexOf(vote.itemId) > -1) {
        votesToTally[vote.itemId] = vote;
    }
}
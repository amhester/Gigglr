"use strict";

var restify = require('restify');
var bunyan = require('bunyan');
var config = require('./app.config.json');

var log = bunyan.createLogger('com.gigglr.server.logger');

var server = restify.createServer({
    name: config.serverName,
    version: config.version
});

server.on('after', function (req, res, route, error) {

});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());

//register routes here



server.listen(config.serverPort, config.serverHost, function () {
    log.info(config.serverName + ' is now running, listening on ' + server.url);
});
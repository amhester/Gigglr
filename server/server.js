"use strict";

var restify = require('restify');
var bunyan = require('bunyan');
var config = require('./app.config.json');
var databaseRoutes = require('./routes/databaseRoutes.js');
var searchRoutes = require('./routes/routes.js');
var database = require('./services/database.js');



var log = bunyan.createLogger({ name: 'com.gigglr.server.logger'});

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

searchRoutes.register(server);
databaseRoutes.register(server);

server.listen(config.serverPort, config.serverHost, function () {
    log.info(config.serverName + ' is now running, listening on ' + server.url);
});
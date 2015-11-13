"use strict";

module.exports = {};
module.exports.register = function (server) {
    server.get('/search/:q', function (req, res, next) {
        var q = req.params.q;
        next();
    });
};
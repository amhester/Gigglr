"use strict";

var request = require('request');

class gcse {
    constructor () {

    }

    search (q, callback) {
        let query = this._requestTemplate;
        query.replace('{q}', q);
        request(query, function (err, response, body) {
            if(!err && response.statusCode != 200) {
                err = new Error("Google Custom Search Engine search was unsuccessful, non-200 response code.");
            }
            callback(err, response, body);
        });
    }
}
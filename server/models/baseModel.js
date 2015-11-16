"use strict";

var appConfig = require('./../app.config.json');
var database = require('../services/database.js');

var error = Symbol();
var titan = Symbol();

class BaseModel{

    constructor(){
        this[error] = '';
        this[titan] = new database();
    }

    get error() {
        return this[error];
    }
    set error(value) {
        this[error] = value;
    }

    get titan() {
        return this[titan];
    }
    set titan(value) {
        this[titan] = value;
    }

    emitResult(resultObject, res, req, next) {
        if(resultObject.error) {
            res.send(500, resultObject.error);
        } else {
            if (resultObject.models && resultObject.models.length > 1){
                var resultArray = [];
                for (var i = 0; i < resultObject.models.length; i++){
                    resultArray.push(resultObject.models[i].toJson());
                }
                res.send(200, resultArray);
            }
            else if (resultObject.models && resultObject.models.length == 0){
                res.send(200, {});
            }
            else
            {
                if (resultObjext.models && resultObject.models.length){
                    res.send(200, resultObject.models[0].toJson());
                }
                else{
                    res.send(200, '');
                }
            }
        }
        next();
    };

    query(q, callback, res, req, next){
        this[titan].execute(q, this.parseResult, res, req, next, callback);
    }

    executeBaseQuery(q, req, res, next, callback){
        if (!callback){
            callback = this.emitResult;
        }
        this.query(q, callback, res, req, next);
    }
}

module.exports = BaseModel;
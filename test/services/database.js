'use strict';

process.env.SECURE_MODE = true;

var chai = require('chai');
chai.should();
var config = require('../../config');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var crypto = require('crypto');

// init

var res = {};
var req = {};
var demoData = '{"el escribimos": "silencio es dorado"}';
var demoDataHash = crypto.createHash('sha512')
.update(demoData)
.digest('hex');

console.log('hash', demoDataHash);
var nextChecker = false;    
var next = function(){
    if(arguments.length > 0){
        console.log(arguments[0]);
    }else{
        nextChecker = true;
    }
    
    return nextChecker;
};
res.json = function(data){
    return res;
};

res.status = function(status){
    return res;
};

var header = {};
res.set = function(key, value){
    header[key] = value;
    return header[key];
};
req.header = function(key){
    return header[key];
};

header.set = function(data){
    header.temp = data;
    return header.temp;
};

req.method = '';


// Testing database service

var db = require('../../services/database/mongo');

describe('#Database service test', function(){
    it('should exist as a function',function(done){
        db.should.exist; /* jslint ignore:line */
        done();
    });
});

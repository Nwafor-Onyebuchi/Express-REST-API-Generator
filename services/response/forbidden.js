"use strict";
var log = require('../logger');
var _ = require('lodash');
var queue = require('../queue');

module.exports = function(data, message){
	log.warn('Sending forbidden response: ', data, message || 'forbidden');
    var req = this.req;
    var res = this;
    
    // Dump it in the queue
    var response = {response: {status: 'error', data: data, message: message ? message : 'forbidden'}};
    response.requestId = req.requestId;
    
    queue.add('logResponse', response)

    if (data !== undefined && data !== null) {
      if(Object.keys(data).length === 0 && JSON.stringify(data) === JSON.stringify({})){
       data = data.toString();
   }
}

if(data){
  this.status(403).json({status: 'error', data: data, message: message ? message : 'forbidden'});
}else{
  this.status(403).json({status: 'error', message: message ? message : 'forbidden'});
}
};

"use strict";
var config = require('./config');
var log = require('./services/logger');
var express = require('express');
var cluster = require('cluster');

if (cluster.isMaster && config.env === 'production') {
  
	// Count the machine's CPUs
	var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
    	cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        // Replace the dead worker,
        // we're not sentimental
        log.info('Worker %d died', worker.id);
        cluster.fork();
    });

}else {

    var app = express();
    var router = require('./routes');
    var express_enforces_ssl = require('express-enforces-ssl');

    if (config.trustProxy === 'yes') {
        app.enable('trust proxy');
    }

    if (config.enforceSSL === 'yes') {
        app.use(express_enforces_ssl());
    }

    app.use('/', router);




    var server = app.listen(config.port, function () {
        var host = server.address().address;
        var port = server.address().port;
        log.info('API server listening on host ' + host + ', port ' + port + '!');
    });

}
// ToDo: Write a complete Documentation for this project

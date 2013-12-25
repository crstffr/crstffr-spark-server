
(function(undefined){

    var log = require('./server/log.js');
    var tcp = require('./server/tcp.js');
    var spark = require('./server/spark.js');
    var config = require('./server/config.js');
    var request = require('./server/request.js');

    // ***********************************************************
    // Display server banner when the TCP server is started
    // ***********************************************************

    tcp.emitter.on('serverStarted', function(ip, port) {
        log.server('*****************************************************');
        log.server('Ready and awaiting connections on', ip + ':' + port);
        log.server('*****************************************************');
    });

    // ***********************************************************
    // Setup module interactions based upon TCP activity
    // ***********************************************************

    tcp.emitter.on('serverStarted', function() {

        spark.connectAll();

    }).on('connectionClosed', function(ip){

        spark.reconnect(ip);

    }).on('messageReceived', function(data){

        request.process(data);

    });

    // ***********************************************************
    // Kick off the server
    // ***********************************************************

    setTimeout(function(){
        tcp.createServer();
    }, 200);

    // ***********************************************************
    // Everything below is just debug console logging
    // ***********************************************************

    if (config.debug) {

        // *******************************
        // TCP specific events
        // *******************************

        if (config.log('tcp')) {

            tcp.emitter.on('connectionTimeout', function(ip, port) {
                var id = spark.getIdByIp(ip);
                log.server(spark.id(id), ip + ':' + port, 'Connection timeout');
            });

            tcp.emitter.on('connectionClosed', function(ip, port) {
                var id = spark.getIdByIp(ip);
                log.server(spark.id(id), ip + ':' + port, 'Connection closed');
            });

            tcp.emitter.on('connectionError', function(ip, port, error) {
                var id = spark.getIdByIp(ip);
                log.server(spark.id(id), ip + ':' + port, 'Connection Error', error);
            });

        }

        // *******************************
        // Spark Core specific events
        // *******************************

        if (config.log('spark')) {

            spark.emitter.on('connecting', function(id) {
                log.server(spark.id(id), 'Attemping connection');
            });

            spark.emitter.on('connected', function(id, ip, port) {
                log.core(spark.id(id), ip + ':' + port, 'Connected');
            });

            spark.emitter.on('timedOut', function(id){
                log.core(spark.id(id), 'Timed out');
            });

            spark.emitter.on('startRetry', function(id){
                log.core(spark.id(id), 'Starting retry');
            });

            spark.emitter.on('stopRetry', function(id){
                log.core(spark.id(id), 'Stoping retry');
            });

            spark.emitter.on('setType', function(id, type){
                log.core(spark.id(id), 'Is', type);
            });

            spark.emitter.on('destroyed', function(id){
                log.core(spark.id(id), 'Destroyed');
            });

        }

    }

}).call(this);
(function(undefined){

    var util    = require('./server/util');
    var tcp     = require('./server/tcp/server');
    var user    = require('./server/system/user');
    var router  = require('./server/router');
    var config  = require('./server/config');
    var behaviors = require('./behaviors');

    // ***********************************************
    // Let's start some shit!
    // ***********************************************

    var user = new user(config.thisUser);
    var devices = user.deviceManager();
    var server = new tcp(devices);
    var router = new router(user);

    // ***********************************************
    // Register all behaviors with the router
    // ***********************************************

    behaviors.forEach(function(behavior){
        router.registerBehavior(behavior);
    });

    // ***********************************************
    // In just moment connect ALL the devices
    // ***********************************************

    setTimeout(function(){
        devices.connectAll();
    }.bind(this), 250);

    // ***********************************************
    // Pass any incoming signals to the router
    // ***********************************************

    server.on('signalReceived', function(device, signal){
        router.parseSignal(device, signal);
    });

    server.on('deviceConnected', function(device){
        // device.execute({command: 'status'});
    });

    // ***********************************************
    // Allow user to reconnect devices from stdin
    // ***********************************************

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(chunk) {
        if (chunk.trim() == 'r') {
            devices.connectAll();
        }
    }.bind(this));

    // ***********************************************
    // Logging
    // ***********************************************

    server.log('*****************************************************');
    server.log('Ready and awaiting connections on', server.ip + ':' + server.port);
    server.log('*****************************************************');
    server.log('Log Level:', config.logLevel);
    server.log('TCP Connection Retries:', config.tcp.connRetries);
    server.log('TCP Connection Timeout:', util.msReadable(config.tcp.connTimeout));
    server.log('TCP Message Timeout:', util.msReadable(config.tcp.msgTimeout));
    server.log('TCP KeepAlive Every:', util.msReadable(config.tcp.heartbeat));
    server.log('TCP KeepAlive Enabled:', config.tcp.keepAlive);
    server.log('*****************************************************');

    server.on('newConnection', function _newConnection(conn) {

        conn.on('identified', function(id){
            //conn.log('Identified as', id);
        });

        conn.on('unidentified', function(error){
            // conn.log('Not Identifed (',error,')');
        });

        conn.on('signalReceived', function(message) {
            //conn.log(message);
        });

        conn.on('close', function(){
            //conn.log('Closed');
        });

    });

}).call(this);
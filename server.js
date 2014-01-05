
(function(undefined){

    var util    = require('./server/util');
    var tcp     = require('./server/tcp/server');
    var user    = require('./server/system/user');
    var router  = require('./server/router');
    var config  = require('./server/config');

    // ***********************************************
    // Let's start some shit!
    // ***********************************************

    var user = new user(config.thisUser);
    var devices = user.deviceManager();
    var server = new tcp(devices);
    var router = new router(user);

    // ***********************************************
    // Setup some stateful defaults
    // ***********************************************

    user.home.set('MOTION', 'DISABLED');

    // ***********************************************
    // In a moment, let's connect ALL the things!
    // ***********************************************

    setTimeout(function(){
        devices.connectAll();
    }.bind(this), 250);

    // ***********************************************
    // I hear you man, and let me respond.
    // ***********************************************

    server.on('signalReceived', function(device, signal){
        router.parseSignal(device, signal);
    });















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

        conn.log('Connected');

        conn.on('identifying', function(){
            //conn.log('Identifying...');
        });

        conn.on('identified', function(data){
            //conn.log('Is', data.id);
        });

        conn.on('unidentified', function(error){
            //conn.log('Not Identifed (',error,')');
        });

        conn.on('signalReceived', function(message) {
            // user.deviceManager().getByIP(conn.ip).log(message);
        });

        conn.on('close', function(){
            conn.log('Closed');
        });

    });



}).call(this);
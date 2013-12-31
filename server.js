
(function(undefined){

    var log = require('./server/log');
    var util = require('./server/util');
    var config = require('./server/config');
    var tcp = require('./server/tcp/server');
    var user = require('./server/system/user');
    var router = require('./server/router');

    // ***********************************************
    // Let's start some shit!
    // ***********************************************

    var user = new user(config.thisUser);
    var devices = user.deviceManager();
    var server = new tcp(devices);
    var router = new router();

    setTimeout(function(){
        devices.connectAll();
    }.bind(this), 250);

    //server.log('Device test', user.deviceManager());
    //server.log('Device test', user.deviceManager().getByID('48ff6b065067555039091087'));

    // ***********************************************
    // We got this!
    // ***********************************************

    server.on('signalReceived', router.route);

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
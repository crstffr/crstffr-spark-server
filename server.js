
(function(undefined){

    var log = require('./server/log');
    var util = require('./server/util');
    var spark = require('./server/spark');
    var config = require('./server/config');
    var router = require('./server/router.js');
    var user = require('./server/system/user.js');
    var devices = require('./server/controllers/devices');
    var tcpServer = require('./server/tcp/server');

    var server = new tcpServer();
    var user   = new user(config.thisUser);

    log.server('*****************************************************');
    log.server('Ready and awaiting connections on', server.ip + ':' + server.port);
    log.server('*****************************************************');
    log.server('Log Level:', config.logLevel);
    log.server('TCP Connection Retries:', config.tcp.connRetries);
    log.server('TCP Connection Timeout:', util.msReadable(config.tcp.connTimeout));
    log.server('TCP Message Timeout:', util.msReadable(config.tcp.msgTimeout));
    log.server('TCP KeepAlive Every:', util.msReadable(config.tcp.heartbeat));
    log.server('TCP KeepAlive Enabled:', config.tcp.keepAlive);
    log.server('*****************************************************');

    server.on('newConnection', function _newConnection(conn) {

        // ***********************************************
        // Logging
        // ***********************************************

        conn.log('Connected');

        conn.on('identifying', function(){
            conn.log('Identifying...');
        });

        conn.on('identified', function(data){
            conn.log('Identified as', data.id);
        });

        conn.on('unidentified', function(error){
            conn.log('Not Identifed (',error,')');
        });

        conn.on('signalReceived', function(message) {
            devices.getByIP(conn.ip).log(message);
        });

        conn.on('close', function(){
            conn.log('Closed');
        });

        // ***********************************************
        // Logic
        // ***********************************************

        // Do we already know who this IP belongs to?
        // If not, then lets identify it, and once
        // the connection has been identified, then
        // associate it with the corresponding device.

        if (config.tcp.requireID) {

            if (!devices.getByIP(conn.ip)) {
                conn.identify().then(function(data) {
                    devices.getByID(data.id).set({
                        ip: conn.ip,
                        port: conn.port,
                        type: data.type
                    }).isConnected(true);
                });
            } else {
                var dev = devices.getByIP(conn.ip).set({
                    ip: conn.ip,
                    port: conn.port
                }).isConnected(true);
                conn.log('Trusted Connection Resumed');
                conn.setIdentity(dev.id, dev.type);
            }

        }

        conn.on('signalReceived', function(signal) {
            if (dev = devices.getByID(conn.device.id)) {
                dev.log(dev);
                dev.dispatch(signal);
            }
        });

        // When a connection closes, check to see if
        // it's associated with a device, and if so,
        // then go ahead and see if it wants to
        // reconnect.

        conn.on('close', function() {
            if (dev = devices.get(conn.device.id, conn.ip)) {
                dev.reconnect();
            } else {
                conn.log('Cannot reconnect unidentified device');
            }
        });


    });

    devices.connectAll(server.ip);

}).call(this);
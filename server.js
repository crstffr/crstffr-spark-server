
(function(undefined){

    var log = require('./server/log');
    var spark = require('./server/spark');
    var config = require('./server/config');
    var device = require('./server/device');
    var devices = require('./server/devices');
    var tcpServer = require('./server/tcp/server');

    var server = new tcpServer();

    log.server('*****************************************************');
    log.server('Ready and awaiting connections on', server.ip + ':' + server.port);
    log.server('*****************************************************');

    server.on('newConnection', function _newConnection(conn) {

        // ***********************************************
        // Logging
        // ***********************************************

        log.tcp('Connection on', conn.toString());

        conn.on('unclaimedMessage', function(message) {
            log.device('Message', message);
        });

        conn.on('identifying', function(){
            log.tcp('Identifying', conn.toString());
        });

        conn.on('identified', function(data){
            log.tcp(conn.toString(), '=', data.id);
        });

        conn.on('unidentified', function(error){
            log.tcp('Connection Not Identifed (' +  error + ')');
        });

        conn.on('close', function(){
            log.tcp('Connection Closed');
        });

        // ***********************************************
        // Logic
        // ***********************************************

        // Do we already know who this IP belongs to?
        // If not, then lets identify it, and once
        // the connection has been identified, then
        // associate it with the corresponding device.

        if (!devices.getByIP(conn.ip)) {
            conn.identify().then(function(data){
                devices.getByID(data.id)
                       .setIP(conn.ip, conn.port)
                       .setType(data.type);
            });
        } else {
            var dev = devices.getByIP(conn.ip);
            conn.setIdentity(dev.id, dev.type);
            log.server('Trusted Connection Resumed');
        }

        // Reconnect
        conn.on('close', function() {
            var id = conn.device.id || devices.getByIP(conn.ip).id;
            if (id) {
                devices.disconnect(id);
                devices.connect(id);
            } else {
                log.server('Closed Unknown Connection');
            }
        });


    });


    devices.connectAll(server.ip);

}).call(this);
(function(undefined){

    var net     = require('net');
    var log     = require('../log');
    var util    = require('../util');
    var config  = require('../config');
    var connection = require('./connection');
    var emitter = require('events').EventEmitter;

    var TCPServer = function(deviceManager) {

        emitter.call(this);

        this.ip = util.getIP();
        this.port = config.tcp.port;
        this.server = this.create();
        this.devices = deviceManager;
        this.server.on('connection', this.onConnection.bind(this));

    };

    util.inherits(TCPServer, emitter, {

        log: function() {
            log.server.apply(log, arguments);
        },

        create: function() {
            return net.createServer().listen(this.port);
        },

        destroy: function() {
            this.server.close();
        },

        onConnection: function(socket) {

            var conn = new connection(socket);

            // Setup a handler that captures signals received
            // from the connection, looks up the device that
            // the connection is associated with, and trigger
            // a server event with the device/signal together.

            conn.on('signalReceived', function(signal) {
                var device;
                if (device = this.devices.getByID(conn.device.id)) {
                    this.emit('signalReceived', device, signal);
                    device.dispatch(signal); // @todo: refactor into router
                }
            }.bind(this));

            // When a connection closes, check to see if it's
            // associated with a device, and if so, go ahead
            // and reconnect it.

            conn.on('close', function() {
                var device;
                if (device = this.devices.get(conn.device.id, conn.ip)) {
                    device.reconnect();
                } else {
                    conn.log('Cannot reconnect unidentified device');
                }
            }.bind(this));

            // Do we already know who this IP belongs to?
            // If not, then lets identify it, and once
            // the connection has been identified, then
            // associate it with the corresponding device.

            if (config.tcp.requireID) {

                if (!this.devices.getByIP(conn.ip)) {

                    conn.identify().then(function(data) {

                        this.devices.getByID(data.id)
                               .setIP(conn.ip)
                               .setPort(conn.port)
                               .isConnected(true);

                    }.bind(this));

                } else {

                    // Connection is already identified and
                    // associated with a device, so at this
                    // point, the only thing to do is update
                    // the device with the new port and tell
                    // it that it is officially connected.

                    var dev = this.devices.getByIP(conn.ip)
                                          .setPort(conn.port)
                                          .isConnected(true);

                    conn.log('Trusted Connection Resumed');
                    conn.setIdentity(dev.id, dev.type);
                }

            }

            // Trigger event informing the listeners of
            // the newly created connection.

            this.emit('newConnection', conn);

        },

        onEnd: function() {
            log.server('Server closed');
        }

    });

    module.exports = TCPServer;

}).call(this);
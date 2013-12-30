(function(undefined){

    var q       = require('q');
    var net     = require('net');
    var log     = require('../log');
    var util    = require('../util');
    var config  = require('../config');
    var tcpConn = require('./connection');
    var emitter = require('events').EventEmitter;

    var TCPServer = function() {

        emitter.call(this);

        this.ip = util.getIP();
        this.port = config.tcp.port;
        this.server = this.create();
        this.server.on('connection', this._onConnection.bind(this));

    };

    util.inherits(TCPServer, emitter, {

        create: function() {
            return net.createServer().listen(this.port);
        },

        destroy: function() {
            this.server.close();
        },

        _onConnection: function(socket) {
            var conn = new tcpConn(socket);
            this.emit('newConnection', conn);
        },

        onEnd: function() {
            log.server('Server closed');
        }

    });

    module.exports = TCPServer;

}).call(this);
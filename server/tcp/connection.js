(function(undefined){

    var Q       = require('q');
    var log     = require('../log');
    var hex     = require('../hex');
    var util    = require('../util');
    var config  = require('../config');
    var emitter = require('events').EventEmitter;
    var message = require('./message');

    var TCPConnection = function(socket) {

        emitter.call(this);

        this.ip = socket.remoteAddress;
        this.port = socket.remotePort;
        this.socket = socket;
        this.buffer = '';

        socket.setEncoding('utf8');

        socket.setTimeout(config.tcp.timeout, function(){
            socket.destroy();
        });

        socket.on('data', this.data.bind(this));
        socket.on('close', this.close.bind(this));

        this.identify();

    };

    util.inherits(TCPConnection, emitter, {

        identify: function() {
            this.socket.write(hex.BEL);
        },

        data: function(data) {


            var char = data[0];

            log.tcp(data);

            //log.tcp('char', char, char == hex.STX, hex.STX);

            /*
            switch (char) {
                case hex.ENQ:
                    this.emit('ENQ');
                    return;
                    break;
                case hex.ACK:
                    this.emit('ACK');
                    return;
                    break;
                case hex.STX:
                    log.tcp('create message');
                    this.message = new message();
                    this.message.on('complete', this._onMessageComplete.bind(this));
                    break;
            }
            */



            //this.message.append(data);

        },

        _onMessageComplete: function(message) {
            this.emit('message', message);
        },

        send: function() {

        },

        close: function() {
            log.tcp('Connection Close');
        }

    });

    module.exports = TCPConnection;

}).call(this);
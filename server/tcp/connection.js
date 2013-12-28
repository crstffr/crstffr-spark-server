(function(undefined){

    var Q       = require('q');
    var log     = require('../log');
    var hex     = require('../hex');
    var util    = require('../util');
    var config  = require('../config');
    var devices = require('../devices');
    var emitter = require('events').EventEmitter;
    var message = require('./message');

    var TCPConnection = function(socket) {

        emitter.call(this);

        this.ip = socket.remoteAddress;
        this.port = socket.remotePort;
        this.device = {id: '', type: ''};
        this.socket = socket;

        socket.setEncoding('utf8');

        socket.setTimeout(config.tcp.connTimeout, function(){
            socket.destroy();
        });

        socket.on('data', this._onData.bind(this));
        socket.on('close', this._onClose.bind(this));

    };

    util.inherits(TCPConnection, emitter, {

        toString: function() {
            return this.ip + ':' + this.port;
        },

        identify: function() {
            this.emit('identifying');
            this.send(hex.BEL).then(function(data){
                this.device = {
                    id: data.who,
                    type: data.what
                };
                devices.associate(this.device, this.socket);
                this.emit('identified', this.device);
            }.bind(this), function(error){
                this.emit('unidentified', error);
                this.socket.destroy();
            }.bind(this));
        },

        _onData: function(data) {

            switch (data[0]) {

                case hex.ENQ:
                    socket.write(ACK);
                    this.emit('ENQ');
                    return;
                    break;

                case hex.ACK:
                    this.emit('ACK');
                    return;
                    break;

                case hex.STX:
                    if (!this.message || this.message.finished) {
                        this._newUnclaimedMessage();
                    }
                    break;
            }

            this.message.append(data);

        },

        _newUnclaimedMessage: function() {
            log.tcp('New Unclaimed Message');
            delete this.message;
            this.message = new message();
            this.message.whenComplete.then(function(data){
                this.emit('unclaimedMessage', data);
            }.bind(this));
        },

        send: function(what) {

            var defer = Q.defer();
            var output = defer;

            if (!this.message || this.message.finished) {
                this.message = new message();
                output = this.message.wait().whenComplete;
            } else {

                log.tcp("Message in progress, cannot create new claimed message");

                this.message.whenComplete.then(function(){

                    log.tcp("Message completed, creating new claimed message");

                    this.message = new message();

                    this.message.whenComplete(function(data){
                        defer.resolve(data);
                    }, function(error) {
                        defer.reject(error);
                    })

                }.bind(this));

                output = defer.promise;

            }

            this.socket.write(what);

            return output;
        },

        _onClose: function() {
            this.emit('close');
        }

    });

    module.exports = TCPConnection;

}).call(this);
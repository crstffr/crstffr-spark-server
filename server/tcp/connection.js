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

        this.uid = util.uid();
        this.ip = socket.remoteAddress;
        this.port = socket.remotePort;
        this.socket = socket;
        this.interval = false;
        this.messages = {};

        // this is populated with the device ID/type when
        // the connection has been identified and the
        // device type has been determined.  Otherwise,
        // this stays false as the connection is pretty
        // much worthless.

        this.device = {id: false, type: false};

        socket.setNoDelay(false);
        socket.setEncoding('utf8');
        socket.on('data', this._onData.bind(this));
        socket.on('close', this._onClose.bind(this));

        // this is the Node socket timeout function, hence
        // the reversed timeout and function params.
        socket.setTimeout(config.tcp.connTimeout, function(){
            socket.destroy();
        });

        this.keepAliveStart();

    };

    util.inherits(TCPConnection, emitter, {

        log: function() {
            var str = this.toString();
            log.tcp.apply(log, util.prependArgs(str, arguments));
        },

        toString: function() {
            return this.ip + ':' + this.port;
        },

        setIdentity: function(id, type) {
            this.device = {id: id, type: type};
        },

        destroy: function() {
            if (this.socket) {
                this.socket.destroy();
                this.socket.removeAllListeners();
                delete this.socket;
            }
        },

        identify: function() {
            this.emit('identifying');
            this.socket.write(hex.BEL);
            return this.waitForIt().then(function(msg) {

                this.setIdentity(msg.who, msg.what);
                this.emit('identified', this.device);
                return this.device;

            }.bind(this), function(error){

                this.emit('unidentified', error);
                this.socket.destroy();

            }.bind(this));

        },

        keepAliveStart: function() {
            if (config.tcp.keepAlive) {
                this.interval = setInterval(
                    this.keepAliveExec.bind(this),
                    config.tcp.heartbeat
                );
            }
        },

        keepAliveStop: function(){
            clearInterval(this.interval);
        },

        keepAliveExec: function() {

            if (!this.device.id) { return; }
            if (!this.socket || this.socket.destroyed) {
                this.keepAliveStop();
                return;
            }

            this.socket.write(hex.ENQ);
            log.tcpKeepAlive(this.toString(), '< ENQ');
            this.waitForIt().then(function(msg){
                if (msg !== hex.ACK) {
                    this.keepAliveError('Response != ACK');
                    log.tcpKeepAlive(
                        this.toString(),
                        'Response was:', msg
                    );
                } else {
                    log.tcpKeepAlive(this.toString(), '> ACK');
                }
            }.bind(this), function(error){
                this.keepAliveError(error);
            }.bind(this));
        },

        keepAliveError: function(error) {
            log.tcpKeepAlive(
                this.toString(),
                'KeepAlive Error:',
                error
            );
            this.keepAliveStop();
            this.socket.destroy();
        },

        _onData: function(data) {

            switch (data[0]) {

                case hex.STX:
                    if (!this.message || this.message.finished) {
                        this.keepAliveStop();
                        this.waitForIt().then(function(data) {
                            this.emit('unclaimedMessage', data);
                            this.keepAliveStart();
                        }.bind(this));
                    }
                    break;

            }

            this.message.append(data);

        },


        waitForIt: function() {

            var defer = Q.defer();
            var output = defer;

            // There is not a message currently being buffered,
            // so go ahead and create a new one from scratch,
            // returning the whenComplete promise for callback.

            if (!this.message || this.message.finished) {
                this.message = new message();
                return this.message.wait().whenComplete;
            }

            // Otherwise there's a message in progress and we
            // don't want to screw it up, so let's bind the
            // creation of our new message onto the completion
            // of the current message.

            this.log('Must wait for current message');

            this.message.whenComplete.then(function(){
                this.message = new message();
                this.message.whenComplete(function(data){
                    defer.resolve(data);
                }, function(error) {
                    defer.reject(error);
                })
            }.bind(this));

            return defer.promise;

        },

        _onClose: function() {
            this.emit('close');
        }

    });

    module.exports = TCPConnection;

}).call(this);
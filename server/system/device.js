(function(undefined){

    var log      = require('../log');
    var util     = require('../util');
    var config   = require('../config');
    var constant = require('../constant');
    var sparky   = require('sparky');

    var panel   = require('./devices/panel');
    var music   = require('./devices/music');
    var power   = require('./devices/power');
    var emitter = require('events').EventEmitter;

    var Device = function(id) {

        emitter.call(this);

        this.id     = id;
        this.is     = false;
        this.ip     = false;
        this.port   = false;
        this.conn   = false;
        this.retry  = false;
        this.retries= 0;
        this.core = new sparky({
            debug: config.spark.debug,
            token: config.spark.token,
            deviceId: this.id
        });

    }

    util.inherits(Device, emitter, {

        log: function() {
            log.device.apply(log, util.prependArgs(this.toString(), arguments));
        },

        toString: function() {
            return this.id.substr(this.id.length - 17);
        },

        ipString: function() {
            return this.ip + ':' + this.port;
        },

        connect: function() {
            this.log('Connecting...');
            this.core.run('connect', util.getIP());
            this.startRetry();
            return this;
        },

        isConnected: function(bool) {
            this.conn = bool;
            if (bool === true) {
                this.log('Connected on', this.ipString());
                this.stopRetry();
            }
            return this;
        },

        disconnect: function() {
            this.log('Disconnecting...');
            this.isConnected(false);
            return this;
        },

        reconnect: function() {
            this.disconnect();
            this.connect();
            return this;
        },

        set: function(data) {
            for(var key in data) {
                if (data.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
            return this;
        },

        setInfo: function(ip, port, type) {
            this.setIP(ip, port);
            this.setType(type);
            return this;
        },

        setIP: function(ip, port) {
            this.ip = ip;
            this.port = port;
            return this;
        },

        setType: function(type) {
            this.type = type;

            // Depending on the device type, inherit
            // some device specific methods

            switch (parseInt(this.type)) {
                case constant.DEVICE_TYPE_PANEL:
                    panel.call(this);
                    util.inherits(this, panel);
                    break;
                case constant.DEVICE_TYPE_MUSIC:
                    music.call(this);
                    util.inherits(this, music);
                    break;
                case constant.DEVICE_TYPE_POWER:
                    power.call(this);
                    util.inherits(this, power);
                    break;
            }

            this.log('Identified as', this.is);

            return this;

        },

        startRetry: function() {
            if (!this.retry && config.tcp.connRetries > 0) {
                this.retry = setInterval(function(){

                    var tooManyTries = this.retries >= config.tcp.connRetries;

                    if (tooManyTries) {
                        this.log('Too many tries, giving up');
                        stop = true;
                    }

                    if (tooManyTries || this.conn) {
                        this.stopRetry();
                        return;
                    }

                    this.log('Attempt', ++this.retries, 'failed');

                    this.connect();

                }.bind(this), config.tcp.connTimeout);
            }
        },

        stopRetry: function() {
            clearInterval(this.retry);
            this.retries = 0;
            this.retry = false;
        }

    });

    module.exports = Device;

}).call(this);
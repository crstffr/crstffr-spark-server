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

    var Device = function(id, device, room) {

        emitter.call(this);

        this.id     = id;
        this.room   = room.toUpperCase();
        this.name   = device.name.toUpperCase();
        this.type   = device.type;

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

        this.inherit(device.type);

    }

    util.inherits(Device, emitter, {

        // ***********************************************
        // Informational Methods
        // ***********************************************

        log: function() {
            log.device.apply(log, util.prependArgs(this.toString(), arguments));
        },

        toString: function() {
            return this.room + ' ' + this.type;
        },

        ipString: function() {
            return this.ip + ':' + this.port;
        },

        // ***********************************************
        // Object Inherit from Device Type
        // ***********************************************

        inherit: function() {

            // Depending on the device type, inherit
            // some device specific methods

            switch (this.type) {
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

        },

        // ***********************************************
        // Public Setters
        // ***********************************************

        setIP: function(ip) {
            this.ip = ip;
            return this;
        },

        setPort: function(port) {
            this.port = port;
            return this;
        },

        isConnected: function(bool) {
            this.conn = bool;
            if (bool === true) {
                this.log('Connected');
                this.stopRetry();
            }
            return this;
        },

        // ***********************************************
        // Public Getter
        // ***********************************************

        component: function(id) {
            for(var comp in this.components) {
                if (this.components.hasOwnProperty(comp)) {
                    if (this.components[comp] == id) {
                        return comp;
                    }
                }
            }
            return false;
        },

        action: function(id) {
            for(var action in constant.ACTIONS) {
                if (constant.ACTIONS.hasOwnProperty(action)) {
                    if (constant.ACTIONS[action] == id) {
                        return action;
                    }
                }
            }
            return false;
        },

        // ***********************************************
        // Connection Handling
        // ***********************************************

        connect: function() {
            this.log('Connecting...');
            this.core.run('connect', util.getIP());
            this.startRetry();
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

        // ***********************************************
        // Connection Retry Handling
        // ***********************************************

        startRetry: function() {
            if (!this.retry && config.tcp.connRetries > 0) {
                this.retry = setInterval(function(){
                    var tooManyTries = this.retries >= config.tcp.connRetries;
                    if (tooManyTries) {
                        this.log('Too many tries, giving up');
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
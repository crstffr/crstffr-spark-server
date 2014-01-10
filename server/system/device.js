(function(undefined){

    var log      = require('../log');
    var util     = require('../util');
    var config   = require('../config');
    var constant = require('../constant');
    var sparky   = require('sparky');

    var panel   = require('./devices/panel');
    var audio   = require('./devices/audio');
    var power   = require('./devices/power');
    var emitter = require('events').EventEmitter;

    var Device = function(name, device, room) {

        emitter.call(this);

        this.id     = device.id;
        this.room   = room;
        this.name   = name.toUpperCase();
        this.type   = device.type;

        this.is     = false;
        this.ip     = false;
        this.port   = false;
        this.retry  = false;
        this.socket = false;
        this.connected = false;
        this.retries = 0;

        this.core = new sparky({
            debug: config.spark.debug,
            token: config.spark.token,
            deviceId: this.id
        });

        this.inherit(device.type);
        this.actions = this.publicActions();

    }

    util.inherits(Device, emitter, {

        // ***********************************************
        // Informational Methods
        // ***********************************************

        log: function() {
            log.device.apply(log, util.prependArgs(this.toString(), arguments));
        },

        toString: function() {
            return this.room + ' ' + this.type + ' ' + this.name;
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
                case constant.DEVICE_TYPE_AUDIO:
                    audio.call(this);
                    util.inherits(this, audio);
                    break;
                case constant.DEVICE_TYPE_POWER:
                    power.call(this);
                    util.inherits(this, power);
                    break;
            }

        },

        // ***********************************************
        // Public Getter
        // ***********************************************

        getComponent: function(id) {
            for(var comp in this.components) {
                if (this.components.hasOwnProperty(comp)) {
                    if (this.components[comp] == id) {
                        return comp;
                    }
                }
            }
            return false;
        },

        getAction: function(id) {
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

        setConnection: function(connection) {
            this.connection = connection;
            this.port = connection.port;
            this.ip = connection.ip;
            this.connected = true;
            this.log('Connected');
            this.stopRetry();
            return this;
        },

        disconnect: function() {
            this.log('Disconnecting...');
            this.core.run('disconnect', util.getIP());
            this.connected = false;
            this.stopRetry();
            return this;
        },

        disconnected: function() {
            this.log('Disconnected');
            this.connected = false;
            this.stopRetry();
            return this;
        },

        sendCommand: function(command) {
            this.connection.socket.write(command);
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
                    if (tooManyTries || this.connected) {
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
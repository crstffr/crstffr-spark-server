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
        this.state = {};

        this.core = new sparky({
            debug: config.spark.debug,
            token: config.spark.token,
            deviceId: this.id
        });

        this.inherit(device.type);

        this.actions = this.publicActions();

        this.setDefaultActions();

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
        // Behavior variable setting/getting/checking
        // ***********************************************

        set: function(key, val) {
            this.state[key] = val;
        },

        get: function(key) {
            return this.state[key];
        },

        check: function(key, val) {
            return this.state[key] == val;
        },

        debug: function() {
            log.debug('DEVICE', this.state);
        },

        // ***********************************************
        // Executing commands against this device
        // ***********************************************

        execute: function(action) {
            command = action.command.toLowerCase();
            if (util.isFunction(this.actions[command])) {
                //this.log('Found command:', command);
                this.actions[command]();
                return true;
            } else {
                this.log('Unknown command:', command);
                return false;
            }
        },

        // ***********************************************
        // All devices have some common actions
        // ***********************************************

        setDefaultActions: function() {

            this.actions.status = function() {
                this.sendCommand(this.commands.STATUS);
            }.bind(this);

        },

        // ***********************************************
        // Object Inherit from Device Type
        // ***********************************************

        inherit: function() {

            // Depending on the device type, inherit
            // some device specific methods

            switch (this.type) {
                case constant.DEVICE_TYPE.PANEL:
                    panel.call(this);
                    util.inherits(this, panel);
                    break;
                case constant.DEVICE_TYPE.AUDIO:
                    audio.call(this);
                    util.inherits(this, audio);
                    break;
                case constant.DEVICE_TYPE.POWER:
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

        getActivity: function(id) {
            if (id == '^') { return 'VALUE'; }
            for(var action in this.activities) {
                if (this.activities.hasOwnProperty(action)) {
                    if (this.activities[action] == id) {
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
            if (!this.connected) {
                this.log('Connecting...');
                this.core.run('connect', util.getIP());
                this.startRetry();
                return this;
            } else {
                this.log('is already connected');
            }
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
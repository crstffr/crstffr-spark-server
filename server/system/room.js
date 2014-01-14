(function(undefined){

    var log     = require('../log');
    var util    = require('../util');
    var config  = require('../config');
    var device  = require('./device');
    var emitter = require('events').EventEmitter;

    var Room = function(id, room) {

        emitter.call(this);

        this.id = id;
        this.name = room.name;
        this.devices = {};
        this.state = {};

        this.set('LIGHT',  'DARK');
        this.set('AUDIO',  'DISABLED');
        this.set('MOTION', 'DISABLED');

        for(var name in room.devices) {
            if (room.devices.hasOwnProperty(name)) {
                var id = room.devices[name].id;
                this.devices[id] = new device(name, room.devices[name], this.id);
            }
        }

    }

    util.inherits(Room, emitter, {

        log: function() {
            log.server.apply(log, util.prependArgs(this.toString(), arguments));
        },

        toString: function() {
            return 'ROOM ' + this.id;
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
            this.log(this.state);
        },

        // ***********************************************
        // Executing commands against devices in the room
        // ***********************************************

        execute: function(action) {
            if (this.executeByType(action)) { return true; }
            if (this.executeByName(action)) { return true; }
            //this.log('Unable to execute action', action);
            return false;
        },

        executeByType: function(action) {
            var executed = 0;
            var result = false;
            this.getDevicesByType(action.which).forEach(function(dev){
                result = dev.execute(action);
                if (result) { executed++; }
            }.bind(this));
            return (executed > 0);
        },

        executeByName: function(action) {
            var executed = 0;
            this.getDevicesByName(action.which).forEach(function(dev){
                result = dev.execute(action);
                if (result) { executed++; }
            }.bind(this));
            return (executed > 0);
        },

        // ***********************************************
        // Get devices from the room based on type or name
        // ***********************************************

        getDevicesByType: function(type) {
            var dev, devices = [];
            for (var id in this.devices) {
                if (this.devices.hasOwnProperty(id)) {
                    dev = this.devices[id];
                    if (dev.type == type) {
                        if (dev.connected) {
                            devices.push(dev);
                        } else {
                            dev.log('is not connected');
                        }
                    }
                }
            }
            if (devices.length === 0) {
                //this.log('No devices of type:', type);
            }
            return devices;
        },

        getDevicesByName: function(name) {
            var dev, devices = [];
            for (var id in this.devices) {
                if (this.devices.hasOwnProperty(id)) {
                    dev = this.devices[id];
                    if (dev.name == name) {
                        if (dev.connected) {
                            devices.push(dev);
                        } else {
                            dev.log('is not connected');
                        }
                    }
                }
            }
            if (devices.length === 0) {
                //this.log('No devices of name:', name);
            }
            return devices;
        }

    });

    module.exports = Room;

}).call(this);
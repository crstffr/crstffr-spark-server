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

        for(var _id in room.devices) {
            if (room.devices.hasOwnProperty(_id)) {
                this.devices[_id] = new device(_id, room.devices[_id], this.id);
            }
        }

    }

    util.inherits(Room, emitter, {

        set: function(key, val) {
            this.state[key] = val;
        },

        get: function(key) {
            return this.state[key];
        },

        check: function(key, val) {
            return this.state[key] == val;
        },

        executeByType: function(type, command) {
            command = command.toLowerCase();
            this.getDevicesByType(type).forEach(function(dev){
                if (util.isFunction(dev[command])) {
                    dev[command]();
                }
            }.bind(this));
        },

        getDevicesByType: function(type) {
            var dev, devices = [];
            for (var id in this.devices) {
                if (this.devices.hasOwnProperty(id)) {
                    dev = this.devices[id];
                    if (dev.type == type) {
                        devices.push(dev);
                    }
                }
            }
            return devices;
        },

        volumeUp: function() {
            // volume up on local music device
        },

        volumeDown: function() {
            // volume down on local music device
        },

        mute: function() {
            // mute on local music device
        },

        unmute: function() {
            // unmute on local music device
        }

    });

    module.exports = Room;

}).call(this);
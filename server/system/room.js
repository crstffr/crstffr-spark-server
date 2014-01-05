(function(undefined){

    var log     = require('../log');
    var util    = require('../util');
    var config  = require('../config');
    var device  = require('./device');
    var emitter = require('events').EventEmitter;

    var Room = function(id, room, home) {

        emitter.call(this);

        this.id = id;
        this.home = home;
        this.name = room.name;
        this.devices = {};

        for(var _id in room.devices) {
            if (room.devices.hasOwnProperty(_id)) {
                this.devices[_id] = new device(_id, room.devices[_id], id);
            }
        }

    }

    util.inherits(Room, emitter, {

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
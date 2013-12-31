(function(undefined){

    var log     = require('../log');
    var room    = require('./room');
    var util    = require('../util');
    var config  = require('../config');
    var emitter = require('events').EventEmitter;

    var Home = function(id, home, user) {

        emitter.call(this);

        this.id = id;
        this.user = user;
        this.name = home.name;
        this.rooms = {};

        for(var _id in home.rooms) {
            if (home.rooms.hasOwnProperty(_id)) {
                this.rooms[_id] = new room(_id, home.rooms[_id], id);
            }
        }

    }

    util.inherits(Home, emitter, {

        room: function(id) {
            if (!this._rooms[id]) {
                throw 'Room does not exist: ' + id;
            }
            return this.rooms[id];
        },

        // Globally adjust music in all rooms
        // and devices in the home

        music: {

            powerOn: function() {
                // turn all music players on
            },

            powerOff: function() {
                // turn all music players off
            },

            volumeUp: function() {
                // turn all music players up
            },

            volumeDown: function() {
                // turn all music players down
            },

            playPause: function() {
                // pause spotify
            },

            skipForward: function() {
                // skip track on spotify
            }

        }


    });

    module.exports = Home;

}).call(this);
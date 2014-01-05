(function(undefined){

    var log     = require('../log');
    var room    = require('./room');
    var util    = require('../util');
    var music   = require('./music');
    var config  = require('../config');
    var emitter = require('events').EventEmitter;

    var Home = function(home, user) {

        emitter.call(this);

        this.user = user;
        this.name = home.name;
        this.rooms = {};
        this.state = {};

        for(var _id in home.rooms) {
            if (home.rooms.hasOwnProperty(_id)) {
                var _uid = _id.toUpperCase();
                this.rooms[_uid] = new room(_uid, home.rooms[_id]);
            }
        }

    }

    util.inherits(Home, emitter, {

        room: function(id) {
            id = id.toUpperCase();
            return this.rooms[id] || false;
        },

        set: function(key, val) {
            this.state[key] = val;
        },

        get: function(key) {
            return this.state[key];
        },

        check: function(key, val) {
            return this.state[key] == val;
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
                music.playPause();
            },

            skipForward: function() {
                music.skipForward();
            }

        }


    });

    module.exports = Home;

}).call(this);
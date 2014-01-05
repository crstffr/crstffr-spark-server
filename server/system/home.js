(function(undefined){

    var log     = require('../log');
    var room    = require('./room');
    var util    = require('../util');
    var music   = require('./music');
    var config  = require('../config');
    var emitter = require('events').EventEmitter;

    var Home = function(id, home, user) {

        emitter.call(this);

        this.id = id;
        this.user = user;
        this.name = home.name;
        this.rooms = {};
        this.state = {};

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

        enable: function(what) {
            this.state[what] = true;
        },

        disable: function(what) {
            this.state[what] = false;
        },

        check: function(what) {
            return this.state[what];
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
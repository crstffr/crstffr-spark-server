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
        this.music = music;
        this.rooms = {};
        this.state = {};

        this.set('LIGHT',  'DARK');
        this.set('AUDIO',  'DISABLED');
        this.set('MOTION', 'DISABLED');

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

        // ***********************************************
        // Behavior variable setting/getting/checking
        // ***********************************************

        set: function(key, val) {
            var id;
            this.state[key] = val;
            for (id in this.rooms) {
                if (this.rooms.hasOwnProperty(id)) {
                    this.rooms[id].set(key, val);
                }
            }
        },

        get: function(key) {
            return this.state[key];
        },

        check: function(key, val) {
            return this.state[key] == val;
        },

        debug: function() {
            log.debug('HOME', this.state);
        },

        // ***********************************************
        // Execute commands on devices in all rooms of home
        // ***********************************************

        execute: function(action) {
            var id;
            for (id in this.rooms) {
                if (this.rooms.hasOwnProperty(id)) {
                    this.rooms[id].execute(action);
                }
            }
        }


    });

    module.exports = Home;

}).call(this);
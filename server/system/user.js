(function(undefined){

    var log     = require('../log');
    var home    = require('./home');
    var data    = require('../data');
    var util    = require('../util');
    var config  = require('../config');
    var constant = require('../constant');
    var emitter = require('events').EventEmitter;

    var User = function(username) {

        emitter.call(this);

        this.name = username;
        this.data = data.users[username];
        this.home = new home(this.data.home, this);
        this.devices = this.getAllDevices();

    }

    util.inherits(User, emitter, {

        execute: function(actions, activity) {

            actions.forEach(function(action) {

                var where;

                if (action.is == 'MUSIC') {
                    this.home.music.execute(action.command);
                    return;
                }

                if (action.is == 'DEBUG' && action.command == 'LOG') {
                    log.debug(activity);
                    return;
                }

                switch (action.where) {
                    case 'HOME':
                        where = this.home;
                        break;
                    case 'ROOM':
                        where = this.home.room(activity.room);
                        break;
                    case 'DEVICE':
                        where = this.getDeviceByName(action.which);
                        break;
                    default:
                        where = this.home.room(action.where);
                        break;
                }

                if (where) {
                    switch(action.is) {
                        case 'PHYSICAL':
                            where.execute(action.which, action.command);
                            break;
                        case 'VARIABLE':
                            where.set(action.key, action.val);
                            break;
                    }
                } else {
                    log.server('Unable to find:', action.where);
                }

            }.bind(this));

        },

        getAllDevices: function() {
            var all = {};
            var rooms = this.home.rooms;
            for(var rid in rooms) {
                if (rooms.hasOwnProperty(rid)) {
                    var devices = rooms[rid].devices;
                    for (var did in devices) {
                        if (devices.hasOwnProperty(did)) {
                            all[did] = devices[did];
                        }
                    }
                }
            }
            return all;
        },

        getDeviceByID: function(id) {
            return this.devices[id] || false;
        },

        getDeviceByName: function(name) {
            for (var id in this.devices) {
                if (this.devices.hasOwnProperty(id)) {
                    if(this.devices[id].name == name) {
                        return this.devices[id];
                    }
                }
            }
            return false;
        },

        getDeviceByIP: function(ip) {
            for (var id in this.devices) {
                if (this.devices.hasOwnProperty(id)) {
                    if(this.devices[id].ip == ip) {
                        return this.devices[id];
                    }
                }
            }
            return false;
        },

        deviceManager: function() {

            var deviceManager = function() {};

            deviceManager.prototype = {

                get: function(id, ip) {
                    return this.getDeviceByID(id) || this.getDeviceByIP(ip);
                }.bind(this),

                getByID: function(id) {
                    return this.getDeviceByID(id);
                }.bind(this),

                getByIP: function(ip) {
                    return this.getDeviceByIP(ip);
                }.bind(this),

                connectAll: function() {
                    for (var id in this.devices) {
                        if (this.devices.hasOwnProperty(id)) {
                            this.devices[id].connect();
                        }
                    }
                }.bind(this)

            };

            return new deviceManager();

        }


    });

    module.exports = User;

}).call(this);
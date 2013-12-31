(function(undefined){

    var log     = require('../log');
    var home    = require('./home');
    var data    = require('../data');
    var util    = require('../util');
    var config  = require('../config');
    var constant = require('../constant');
    var emitter = require('events').EventEmitter;

    var User = function(id) {

        emitter.call(this);

        if (!data.users[id]) {
            throw "Invalid User: " + id;
        }

        this.id = id;
        this.data = data.users[id];
        this.name = this.data.name;
        this.homes = {};
        this.rooms = {};
        this.devices = {};

        this.initHomes();
    }

    util.inherits(User, emitter, {

        initHomes: function() {
            for(var _id in this.data.homes) {
                if (this.data.homes.hasOwnProperty(_id)) {
                    this.homes[_id] = new home(_id, this.data.homes[_id], this.id);
                }
            }
            this.rooms = this.getAllRooms();
            this.devices = this.getAllDevices();
        },

        getAllRooms: function() {
            var all = {};
            var homes = this.homes;
            for(var hid in homes) {
                if (homes.hasOwnProperty(hid)) {
                    var rooms = homes[hid].rooms;
                    for(var rid in rooms) {
                        if (rooms.hasOwnProperty(rid)) {
                            all[rid] = rooms[rid];
                        }
                    }
                }
            }
            return all;
        },

        getAllDevices: function() {
            var all = {};
            var rooms = this.getAllRooms();
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

        room: function(id) {
            return this.rooms[id];
        },

        device: function(id) {
            return this.devices[id] || false;
        },

        deviceByIP: function(ip) {
            for (var id in this.devices) {
                if (this.devices.hasOwnProperty(id)) {
                    if(this.devices[id] == ip) {
                        return this.devices[id];
                    }
                }
            }
            return false;
        },

        deviceManager: function() {

            var deviceManager = function() {};

            deviceManager.prototype.get = function(id, ip) {
                return this.device(id) || this.deviceByIP(ip);
            }.bind(this);

            deviceManager.prototype.getByID = function(id) {
                return this.device(id);
            }.bind(this);

            deviceManager.prototype.getByIP = function(ip) {
                return this.deviceByIP(ip);
            }.bind(this);

            deviceManager.prototype.connectAll = function() {
                for (var id in this.devices) {
                    if (this.devices.hasOwnProperty(id)) {
                        this.devices[id].connect();
                    }
                }
            }.bind(this)

            return new deviceManager();

        }


    });

    module.exports = User;

}).call(this);
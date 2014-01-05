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

        if (!data.users[username]) {
            throw "Invalid User: " + username;
        }

        this.name = username;
        this.data = data.users[username];
        this.home = {};
        this.rooms = {};
        this.devices = {};

        this.initHome();
    }

    util.inherits(User, emitter, {

        initHome: function() {
            this.home = new home(this.data.home, this.name);
            this.rooms = this.home.rooms;
            this.devices = this.getAllDevices();
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

        deviceByType: function(type, room) {
            var output, device;
            room = room || false;
            for (var id in this.devices) {
                if (this.devices.hasOwnProperty(id)) {
                    device = this.devices[id];
                    if (device.type == type) {
                        if (!room || (room && device.room)) {
                            output[id] = device;
                        }
                    }
                }
            }
            return output;
        },

        deviceManager: function() {

            var deviceManager = function() {};

            deviceManager.prototype.connectAll = function() {
                for (var id in this.devices) {
                    if (this.devices.hasOwnProperty(id)) {
                        this.devices[id].connect();
                    }
                }
            }.bind(this);

            deviceManager.prototype.get = function(id, ip) {
                return this.device(id) || this.deviceByIP(ip);
            }.bind(this);

            deviceManager.prototype.getByID = function(id) {
                return this.device(id);
            }.bind(this);

            deviceManager.prototype.getByIP = function(ip) {
                return this.deviceByIP(ip);
            }.bind(this);

            deviceManager.prototype.getByType = function(type, room) {
                return this.deviceByType(type, room);
            }.bind(this);

            deviceManager.prototype.execute = function(command, type, room) {
                var device = this.deviceByType(type, room);
                this.log('Exec', command, type, room, device);
             }.bind(this)

            return new deviceManager();

        }


    });

    module.exports = User;

}).call(this);
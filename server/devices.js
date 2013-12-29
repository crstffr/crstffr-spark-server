(function(undefined){

    var log     = require('./log');
    var util    = require('./util');
    var device  = require('./device');
    var config  = require('./config');
    var emitter = require('events').EventEmitter;

    var Devices = function() {

        emitter.call(this);
        this.container = {};
        this.init();

    };

    util.inherits(Devices, emitter, {

        init: function() {
            var id, dev;
            var cores = config.spark.cores;
            for(var i=0; i < cores.length; i++) {
                id  = cores[i];
                dev = new device(id);
                this.container[id] = dev;
            }
        },

        connect: function(id) {
            this.container[id].connect();
        },

        disconnect: function(id) {
            this.container[id].disconnect();
        },

        connectAll: function(ip) {
            for(var id in this.container) {
                if (this.container.hasOwnProperty(id)) {
                    this.connect(id);
                }
            }
        },

        getByID: function(id) {
            return this.container[id];
        },

        getByIP: function(ip) {
            for(var id in this.container) {
                if (this.container.hasOwnProperty(id)) {
                    if (this.container[id].ip === ip) {
                        return this.container[id];
                    }
                }
            }
            return false;
        }


    });

    module.exports = new Devices();

}).call(this);
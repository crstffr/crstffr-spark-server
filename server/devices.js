(function(undefined){

    var log     = require('./log');
    var util    = require('./util');
    var spark   = require('./spark');
    var config  = require('./config');
    var emitter = require('events').EventEmitter;

    var Devices = function() {

        emitter.call(this);
        this.cores = {};
        this.init();

    }

    util.inherits(Devices, emitter, {

        init: function() {
            var id, core;
            var cores = config.spark.cores;
            for(var i=0; i < cores.length; i++) {
                id = cores[i];
                core = new spark(id);
                this.cores[id] = core;
            }
        },

        connectAll: function(ip) {
            for (id in this.cores) {
                if (this.cores.hasOwnProperty(id)) {
                    this.cores[id].connect(ip);
                }
            }
        },

        associate: function(device, connection) {
            var id = device.id;
            this.cores[id].identify(connection);
        }

    });

    module.exports = new Devices();

}).call(this);
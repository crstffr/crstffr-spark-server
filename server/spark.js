/*
(function(undefined){

    var log     = require('./log');
    var util    = require('./util');
    var config  = require('./config');
    var sparky  = require('sparky');
    var emitter = require('events').EventEmitter;

    function Spark(id) {

        log.core('new spark device');

        this.id = id;
        this.sid = id.substr(id.length - 5);
        this.core = new sparky({
            token: config.spark.token,
            deviceId: this.id,
            debug: true
        });



    }

    util.inherits(Spark, emitter, {

        connect: function(ip) {
            ip = ip || util.getIP();
            log.server('Asking Core', this.sid,'to connect');
            this.core.run('connect', ip);
        }

    });

    module.exports = Spark;

}).call(this);*/

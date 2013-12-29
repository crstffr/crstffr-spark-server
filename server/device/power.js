(function(undefined){

    var log     = require('../log');
    var util    = require('../util');
    var config  = require('../config');
    var constant = require('../constant');

    var emitter = require('events').EventEmitter;

    var Power = function() {

        emitter.call(this);
        this.is = "POWER";

    }

    util.inherits(Power, emitter, {



    });

    module.exports = Power;

}).call(this);
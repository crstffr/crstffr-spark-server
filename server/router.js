(function(undefined){

    var log     = require('./log');
    var util    = require('./util');
    var config  = require('./config');
    var constant = require('./constant');

    var emitter = require('events').EventEmitter;

    var Router = function() {

        emitter.call(this);
        this.routes = {




        }

    }

    util.inherits(Router, emitter, {

        route: function(deviceID, event) {



        }

    });

    module.exports = new Router();

}).call(this);
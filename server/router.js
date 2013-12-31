(function(undefined){

    var log     = require('./log');
    var util    = require('./util');
    var config  = require('./config');
    var constant = require('./constant');

    var emitter = require('events').EventEmitter;

    var Router = function() {

        emitter.call(this);
    }

    util.inherits(Router, emitter, {

        route: function(device, signal) {

            var who, what;
            device.log('said', signal);
            //log.server('Router heard signal', signal);

            switch(device.type) {

                case constant.DEVICE_TYPE_PANEL:



                    break;

            }





        }

    });

    module.exports = Router;

}).call(this);
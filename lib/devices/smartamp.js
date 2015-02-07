(function(undefined) {

    var Device = require('../device');
    var config = require('../../config');
    var util = require('util');

    function SmartAmp(id) {

        Device.call(this, id);

        this.type = 'smartamp';

        this.loadComponents({
            'amp': {
                type: 'amp'
            },
            'led': {
                type: 'rgb-led'
            },
            'up-btn': {
                type: 'button'
            },
            'dn-btn': {
                type: 'button'
            },
            'motorpot': {
                type: 'potentiometer'
            },
            'rxrelay': {
                type: 'relay'
            }
        });

        this.components['up-btn'].onPress(function(){

        }.bind(this));


        this.components['dn-btn'].onPress(function(){

        }.bind(this));

    }

    util.inherits(SmartAmp, Device);


    /**
     * When this class is instantiated, send any configuration data
     * from our server back to the device (if there is any)
     */
    SmartAmp.prototype.configure = function() {

        Device.prototype.configure.call(this);

        var cfg = config.devices.smartamp;

        this.debug(cfg.debug);

    };


    module.exports = SmartAmp;

}).call(this);
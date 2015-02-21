(function(undefined) {

    var Device = require('../device');
    var config = require('../../config');
    var util = require('util');

    function TesterDevice(id) {

        Device.call(this, id);

        this.type = 'tester';

        this.loadComponents({
            'btn1': {
                type: 'button'
            },
            'btn2': {
                type: 'button'
            },
            'dac': {
                type: 'dac'
            },
            'adc': {
                type: 'adc'
            },
            'test': {
                type: 'generic'
            }
        });

        this.components['btn1'].onPress(function() {
            this.sendCommand('test', 'stop');
        }.bind(this));

        this.components['btn1'].onHold(function() {
            this.sendCommand('test', 'start');
        }.bind(this));

        this.components['adc'].onRead(function(val) {
            this.log('ADC value read', val);
        }.bind(this));

    }

    util.inherits(TesterDevice, Device);

     /**
     * When this class is instantiated, send any configuration data
     * from our server back to the device (if there is any)
     */
    TesterDevice.prototype.configure = function() {
        Device.prototype.configure.call(this);
        var cfg = config.devices.tester;
        this.debug(cfg.debug);
    };

    module.exports = TesterDevice;

}).call(this);
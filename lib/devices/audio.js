(function(undefined) {

    var util = require('util');
    var config = require('../../config');
    var spotimote = require('../services/spotimote');
    var Device = require('../device');


    function AudioDevice(id) {

        Device.call(this, id);

        this.type = 'Audio';

        this.loadComponents({
            'power': {
                type: 'power'
            },
            'enc': {
                type: 'quad-encoder'
            },
            'led': {
                type: 'rgb-led'
            },
            'volume': {
                type: 'volume'
            },
            'enc-button': {
                type: 'button'
            },
            'led-button': {
                type: 'button'
            },
            'misc-button': {
                type: 'button'
            }
        });

    }

    util.inherits(AudioDevice, Device);


    /**
     *
     */
    AudioDevice.prototype.configure = function() {

        Device.prototype.configure.call(this);

        var cfg = config.devices.audio;

        if (cfg.radio.station) {
            this.sendCommand('radio/station', cfg.radio.station);
        }

        if (cfg.radio.volume) {
            this.sendCommand('radio/volume', cfg.radio.volume);
        }

    }

    /**
     *
     * @param who
     * @param what
     */
    AudioDevice.prototype.action = function(who, what) {

        Device.prototype.action.call(this, who, what);

        if (who == 'enc-button' && what == 'press') {

            this.sendCommand('power', 'toggle');

        }

        if (who == 'led-button' && what == 'press') {

            this.sendCommand('status/all', '1');

        }

        if (who == 'misc-button' && what == 'press') {

            spotimote.skipForward();

        }
    }



    module.exports = AudioDevice;

}).call(this);
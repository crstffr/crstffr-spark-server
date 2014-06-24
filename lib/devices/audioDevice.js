(function(undefined) {

    var Device = require('../device');
    var config = require('../../config');
    var spotimote = require('../services/spotimote');
    var util = require('util');

    function AudioDevice(id) {

        Device.call(this, id);

        this.type = 'audio';

        this.loadComponents({
            'amp': {
                type: 'amp'
            },
            'radio': {
                type: 'fm-radio'
            },
            'knob': {
                type: 'quad-encoder'
            },
            'led': {
                type: 'rgb-led'
            },
            'knob-btn': {
                type: 'button'
            },
            'misc-btn': {
                type: 'button'
            },
            'led-btn': {
                type: 'button'
            }
        });

        this.components['led-btn'].onPress(function(){
            this.sendCommand('status/all', '1');
        }.bind(this));

        this.components['misc-btn'].onPress(function(){
            spotimote.skipForward();
        }.bind(this));

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


    module.exports = AudioDevice;

}).call(this);
(function(undefined) {

    var Device = require('../device');
    var config = require('../../config');
    var spotimote = require('../services/spotimote');
    var log = require('../utils/log').firebase;
    var util = require('util');

    function AudioDevice(id, data) {

        Device.call(this, id);

        this.type = 'Audio';

        this.loadComponents({
            'power': {
                type: 'power'
            },
            'radio': {
                type: 'fm-radio'
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

        this.components['enc-button'].onPress(function(){
            this.sendCommand('power', 'toggle');
        }.bind(this));

        this.components['led-button'].onPress(function(){
            this.sendCommand('status/all', '1');
        }.bind(this));

        this.components['misc-button'].onPress(function(){
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
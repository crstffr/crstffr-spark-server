(function(undefined) {

    var Device = require('../device');
    var config = require('../../config');
    var spotimote = require('../services/spotimote');
    var devices = require('../factories/deviceFactory');
    var util = require('util');

    function PanelDevice(id) {

        Device.call(this, id);

        this.type = 'panel';

        this.loadComponents({
            'pir': {
                type: 'pir'
            },
            'knob': {
                type: 'quad-encoder'
            },
            'btn0': {
                type: 'button'
            },
            'btn1': {
                type: 'button'
            },
            'btn2': {
                type: 'button'
            },
            'btn3': {
                type: 'button'
            },
            'btn4': {
                type: 'button'
            }
        });

        devices.get('48ff6b065067555039091087').then(function(audio){

            this.components['btn0'].onPress(function(){
                audio.getComponent('amp').powerToggle();
            });

            this.components['knob'].onUp(function(){
                audio.getComponent('amp').volumeUp();
            });

            this.components['knob'].onDown(function(){
                audio.getComponent('amp').volumeDown();
            });

        }.bind(this));

        this.components['btn1'].onPress(function(){
            spotimote.skipForward();
        }.bind(this));



    }

    util.inherits(PanelDevice, Device);

    module.exports = PanelDevice;

}).call(this);
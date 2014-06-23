(function(undefined) {

    var Device = require('../device');
    var config = require('../../config');
    var spotimote = require('../services/spotimote');
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

        this.components['btn0'].onPress(function(){
            this.log("Knob pressed");
        }.bind(this));

        this.components['btn1'].onPress(function(){
            this.log("Button 1 pressed");
        }.bind(this));

        this.components['knob'].onUp(function(){
            this.log("Knob up");
        }.bind(this));

        this.components['knob'].onDown(function(){
            this.log("Knob down");
        }.bind(this));

    }

    util.inherits(PanelDevice, Device);

    module.exports = PanelDevice;

}).call(this);
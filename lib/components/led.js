(function(undefined) {

    var util = require('util');
    var Component = require('../component');

    function LedComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['state', 'intensity']);

        this.attrs.state.onChange(this.power, this);

        this.attrs.intensity.onChange(this.intensity, this);

    }

    util.inherits(LedComponent, Component);

    LedComponent.prototype.power = function(val) {
        (val == 'on') ? this.powerOn() : this.powerOff();
    };

    LedComponent.prototype.intensity = function(val) {
        this.sendCommand('intensity', val);
    };

    LedComponent.prototype.powerOn = function() {
        this.sendCommand('state', 'on');
    };

    LedComponent.prototype.powerOff = function() {
        this.sendCommand('state', 'off');
    };

    module.exports = LedComponent;

}).call(this);
(function(undefined){

    var util = require('util');
    var LedComponent = require('./led');
    var Component = require('../component');


    function RGBLedComponent() {

        LedComponent.apply(this, arguments);

        this.setAttrs(['color']);

        this.attrs.color.onChange(this.color, this);

    }

    util.inherits(RGBLedComponent, LedComponent);

    /**
     * Set the color of the RGBLed to one of a handul
     * of string based colors.  Right now it's just
     * limited to the following:
     *
     * red, green, blue, cyan, magenta, yellow, orange
     *
     * @param {String} color
     */
    RGBLedComponent.prototype.color = function(color) {
        this.sendCommand('color', color);
    };

    module.exports = RGBLedComponent;

}).call(this);
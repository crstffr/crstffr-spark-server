(function(undefined){

    var util = require('util');
    var LedComponent = require('./led');

    function RGBLedComponent() {

        LedComponent.call(this, 'rgb-led');

    }

    util.inherits(RGBLedComponent, LedComponent);

    module.exports = RGBLedComponent;

}).call(this);
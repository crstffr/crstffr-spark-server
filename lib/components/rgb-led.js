(function(undefined){

    var util = require('util');
    var LedComponent = require('./led');
    var Component = require('../component');


    function RGBLedComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(RGBLedComponent, Component);
    util.inherits(RGBLedComponent, LedComponent);

    module.exports = RGBLedComponent;

}).call(this);
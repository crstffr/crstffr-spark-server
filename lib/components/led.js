(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function LedComponent() {

        Component.call(this, 'led');

    }

    util.inherits(LedComponent, Component);

    module.exports = LedComponent;

}).call(this);
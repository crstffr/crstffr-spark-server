(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function LedComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(LedComponent, Component);

    module.exports = LedComponent;

}).call(this);
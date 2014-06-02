(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function PowerComponent() {

        Component.call(this, 'power');

    }

    util.inherits(PowerComponent, Component);

    module.exports = PowerComponent;

}).call(this);
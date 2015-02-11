(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function DacComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(DacComponent, Component);

    module.exports = DacComponent;

}).call(this);
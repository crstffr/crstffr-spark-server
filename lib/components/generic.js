(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function GenericComponent() {
        Component.apply(this, arguments);
    }

    util.inherits(GenericComponent, Component);

    module.exports = GenericComponent;

}).call(this);
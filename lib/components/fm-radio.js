(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function FMRadioComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(FMRadioComponent, Component);

    module.exports = FMRadioComponent;

}).call(this);
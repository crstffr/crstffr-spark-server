(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function ADCComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['value']);

    }

    util.inherits(ADCComponent, Component);

    ADCComponent.prototype.onRead = function(fn) {
        this.attrs.value.onRead(fn);
    };

    module.exports = ADCComponent;

}).call(this);
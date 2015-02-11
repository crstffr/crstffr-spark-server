(function(undefined){

    var util = require('util');
    var moment = require('moment');
    var Component = require('../component');

    function PotentiometerComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['value']);

        this.attrs.value.onChange(function(val){

            console.log('pot value changed to ', val);

        }, this);

    }

    util.inherits(PotentiometerComponent, Component);

    PotentiometerComponent.prototype.onChange = function(fn){
        this.when('', 'change', fn);
    };

    module.exports = PotentiometerComponent;

}).call(this);
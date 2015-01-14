(function(undefined){

    var util = require('util');
    var moment = require('moment');
    var Component = require('../component');

    function PotentiometerComponent() {

        Component.apply(this, arguments);

        this.onChange(function(value){
            this.node.update({'value': value});
        }.bind(this));

    }

    util.inherits(PotentiometerComponent, Component);

    PotentiometerComponent.prototype.onChange = function(fn){
        this.when('', 'change', fn);
    };

    module.exports = PotentiometerComponent;

}).call(this);
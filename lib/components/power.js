(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function PowerComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(PowerComponent, Component);

    PowerComponent.prototype.onOn = function(fn){
        this.when('state', 'on', fn);
    };

    PowerComponent.prototype.onOff = function(fn){
        this.when('state', 'off', fn);
    };

    module.exports = PowerComponent;

}).call(this);
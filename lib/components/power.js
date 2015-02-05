(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function PowerComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['state']);

        this.attrs.state.onChange(this.stateChanged, this);

    }

    util.inherits(PowerComponent, Component);


    PowerComponent.prototype.stateChanged = function(val) {
        (val == 'on') ? this.turnOn() : this.turnOff();
    };

    PowerComponent.prototype.reset = function() {
        this.attr.state.set('off'); // updateDatabase('state', 'off');
    };

    PowerComponent.prototype.turnOn = function() {
        this.sendCommand('state', 'on');
    };

    PowerComponent.prototype.turnOff = function() {
        this.sendCommand('state', 'off');
    };

    PowerComponent.prototype.toggle = function() {
        this.sendCommand('state', 'toggle');
    };

    PowerComponent.prototype.onOn = function(fn){
        this.when('state', 'on', fn);
    };

    PowerComponent.prototype.onOff = function(fn){
        this.when('state', 'off', fn);
    };

    module.exports = PowerComponent;

}).call(this);
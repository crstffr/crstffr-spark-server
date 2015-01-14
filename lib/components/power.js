(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function PowerComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(PowerComponent, Component);

    PowerComponent.prototype.changed = function(status) {

        switch (status.state) {
            case 'on':
                this.turnOn();
                break;
            case 'off':
                this.turnOff();
                break;
        }

    };

    PowerComponent.prototype.reset = function() {
        this.updateDatabase('state', 'off');
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
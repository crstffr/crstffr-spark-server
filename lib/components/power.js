(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function PowerComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(PowerComponent, Component);

    PowerComponent.prototype.update = function(status) {

        switch (status.state) {
            case 'on':
                this.turnOn();
                break;
            case 'off':
                this.turnOff();
                break;
        }

    }

    PowerComponent.prototype.turnOn = function() {
        this.log("power on");
        this.sendCommand('state', 'on');
    };

    PowerComponent.prototype.turnOff = function() {
        this.log("power off");
        this.sendCommand('state', 'off');
    };

    PowerComponent.prototype.toggle = function() {
        this.log("power toggle");
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
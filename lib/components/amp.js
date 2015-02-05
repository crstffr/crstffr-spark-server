(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function AmpComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['power', 'volume']);

        this.getAttr('power').onChange(this.power, this);

        this.getAttr('volume').onChange(this.volumeSet, this);


    }

    util.inherits(AmpComponent, Component);

    AmpComponent.prototype.reset = function(status) {
        /*
        this.node.update({
            'power': 'off'
        });
        */
    };

    AmpComponent.prototype.volumeUp = function() {
        if (this.status.volume < 64) {
            this.status.volume++;
            this.node.update({volume: this.status.volume});
            this.volumeSet(this.status.volume);
        }
    };

    AmpComponent.prototype.volumeDown = function() {
        if (this.status.volume > 0) {
            this.status.volume--;
            this.node.update({volume: this.status.volume});
            this.volumeSet(this.status.volume);
        }
    };

    AmpComponent.prototype.volumeSet = function(level) {
        level = parseInt(level, 10);
        this.sendCommand('volume', level + '');
    };

    AmpComponent.prototype.power = function(val) {
        (val == 'on') ? this.powerOn() : this.powerOff();
    };

    AmpComponent.prototype.powerOn = function() {
        this.sendCommand('power', 'on');
    };

    AmpComponent.prototype.powerOff = function() {
        this.sendCommand('power', 'off');
    };

    AmpComponent.prototype.powerToggle = function() {
        this.sendCommand('power', 'toggle');
    };

    AmpComponent.prototype.onPowerOn = function(fn){
        this.when('power', 'on', fn);
    };

    AmpComponent.prototype.onPowerOff = function(fn){
        this.when('power', 'off', fn);
    };

    module.exports = AmpComponent;

}).call(this);
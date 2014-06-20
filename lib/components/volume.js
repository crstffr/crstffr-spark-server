(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function VolumeComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(VolumeComponent, Component);

    VolumeComponent.prototype.reset = function(status) {
        this.updateDatabase('level', 0);
    }

    VolumeComponent.prototype.changed = function(status) {
        this.setLevel(status.level);
    }

    VolumeComponent.prototype.setLevel = function(level) {
        level = parseInt(level, 10);
        this.sendCommand('set', level);
    }

    module.exports = VolumeComponent;

}).call(this);
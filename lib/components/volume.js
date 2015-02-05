(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function VolumeComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['level']);

    }

    util.inherits(VolumeComponent, Component);

    VolumeComponent.prototype.reset = function(status) {
        this.attr.level.set(0); //updateDatabase('level', 0);
    };

    VolumeComponent.prototype.changed = function(attr, val) {
        if (attr == 'level') {
            this.setLevel(val);
        }

    };

    VolumeComponent.prototype.setLevel = function(level) {
        level = parseInt(level, 10);
        this.sendCommand('set', level);
    };

    module.exports = VolumeComponent;

}).call(this);
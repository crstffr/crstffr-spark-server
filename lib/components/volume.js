(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function VolumeComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['level']);

        this.getAttr('level').onChange(this.setLevel, this);

    }

    util.inherits(VolumeComponent, Component);

    VolumeComponent.prototype.setLevel = function(level) {
        level = parseInt(level, 10);
        this.sendCommand('level', level);
    };

    module.exports = VolumeComponent;

}).call(this);
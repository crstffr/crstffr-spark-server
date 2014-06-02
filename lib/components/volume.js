(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function VolumeComponent() {

        Component.call(this, 'volume');

    }

    util.inherits(VolumeComponent, Component);

    module.exports = VolumeComponent;

}).call(this);
(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function VolumeComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(VolumeComponent, Component);



    module.exports = VolumeComponent;

}).call(this);
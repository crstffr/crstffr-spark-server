(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function QuadEncoderComponent() {

        Component.call(this, 'quad-encoder');

    }

    /**
     *
     */
    QuadEncoderComponent.prototype.up = function() {

        console.log("quad encoder up");

    }

    /**
     *
     */
    QuadEncoderComponent.prototype.down = function() {

        console.log("quad encoder down");

    }

    util.inherits(QuadEncoderComponent, Component);

    module.exports = QuadEncoderComponent;

}).call(this);
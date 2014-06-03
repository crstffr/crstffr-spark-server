(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function QuadEncoderComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(QuadEncoderComponent, Component);


    QuadEncoderComponent.prototype.onUp = function(fn){
        this.when('', 'up', fn);
    };

    QuadEncoderComponent.prototype.onDown = function(fn){
        this.when('', 'down', fn);
    };

    module.exports = QuadEncoderComponent;

}).call(this);
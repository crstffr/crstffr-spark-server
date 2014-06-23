(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function PirComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(PirComponent, Component);

    PirComponent.prototype.onMotion = function(fn){
        this.when('motion', fn);
    };

    module.exports = PirComponent;

}).call(this);
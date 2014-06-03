(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function ButtonComponent() {

        Component.apply(this, arguments);

    }

    util.inherits(ButtonComponent, Component);

    ButtonComponent.prototype.onPress = function(fn) {
        this.when('', 'press', fn);
    }

    ButtonComponent.prototype.onHold = function(fn) {
        this.when('', 'hold', fn);
    }


    module.exports = ButtonComponent;

}).call(this);
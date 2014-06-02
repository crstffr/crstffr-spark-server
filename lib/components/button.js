(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function ButtonComponent() {

        Component.call(this, 'button');

    }

    /**
     *
     */
    ButtonComponent.prototype.press = function() {

        console.log("button press");

    }

    /**
     *
     */
    ButtonComponent.prototype.hold = function() {

        console.log("button hold");

    }

    util.inherits(ButtonComponent, Component);

    module.exports = ButtonComponent;

}).call(this);
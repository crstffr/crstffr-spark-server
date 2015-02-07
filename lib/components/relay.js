(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function RelayComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['state']);

        this.getAttr('state').onChange(this.state, this);

    }

    util.inherits(RelayComponent, Component);


    RelayComponent.prototype.state = function(val) {
        (val == 'open') ? this.open() : this.close();
    };

    RelayComponent.prototype.open = function() {
        this.sendCommand('open', '1');
    };

    RelayComponent.prototype.close = function() {
        this.sendCommand('close', '1');
    };

    RelayComponent.prototype.onOpen = function(fn) {
        this.when('', 'open', fn);
    };

    RelayComponent.prototype.onClose = function(fn) {
        this.when('', 'close', fn);
    };


    module.exports = RelayComponent;

}).call(this);
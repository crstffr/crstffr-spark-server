(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function DACComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['value']);

        this.getAttr('value').onChange(function(val) {
            this.setValue(val);
        }, this);

    }

    util.inherits(DACComponent, Component);

    DACComponent.prototype.setValue = function(val) {
        val = (val < 0) ? 0 : (val > 4095) ? 4095 : val;
        this.sendCommand('value', val);
    };

    module.exports = DACComponent;

}).call(this);
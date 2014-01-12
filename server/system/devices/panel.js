(function(undefined){

    var log     = require('../../log');
    var config  = require('../../config');
    var constant = require('../../constant');

    var PanelDevice = function() {

        this.is = 'PANEL';
        this.components = constant.DEVICE_PANEL;

        this.publicActions = function() {
            var actions = function(){};
            actions.prototype = {

                test: function() {
                    this.log('Testing...');
                }.bind(this),

                ledoff: function() {
                    this.log('Turn LED off');
                    this.sendCommand(constant.COMMANDS.OFF);
                }.bind(this),

                ledred: function() {
                    this.log('Turn LED red');
                    this.sendCommand(constant.COMMANDS.RED);
                }.bind(this),

                ledgreen: function() {
                    this.log('Turn LED green');
                    this.sendCommand(constant.COMMANDS.GREEN);
                }.bind(this),

                ledblue: function() {
                    this.log('Turn LED blue');
                    this.sendCommand(constant.COMMANDS.BLUE);
                }.bind(this)

            };
            return new actions();
        };

    }

    module.exports = PanelDevice;

}).call(this);
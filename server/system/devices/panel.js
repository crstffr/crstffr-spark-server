(function(undefined){

    var log     = require('../../log');
    var config  = require('../../config');
    var constant = require('../../constant');

    var Panel = function() {

        this.is = 'PANEL';
        this.components = constant.DEVICE_PANEL;

        this.publicActions = function() {
            var actions = function(){};
            actions.prototype = {

                test: function() {
                    this.log('Testing...');
                }.bind(this),

                red: function() {
                    this.log('Turn it red');
                    this.sendCommand(constant.COMMANDS.RED);
                }.bind(this),

                green: function() {
                    this.log('Turn it green');
                    this.sendCommand(constant.COMMANDS.GREEN);
                }.bind(this),

                blue: function() {
                    this.log('Turn it blue');
                    this.sendCommand(constant.COMMANDS.BLUE);
                }.bind(this)

            };
            return new actions();
        };

    }

    module.exports = Panel;

}).call(this);
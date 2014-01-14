(function(undefined){

    var log     = require('../../log');
    var config  = require('../../config');
    var constant = require('../../constant');

    var PanelDevice = function() {

        this.is = 'PANEL';

        this.activities = constant.DEVICE_PANEL.ACTIVITIES;
        this.components = constant.DEVICE_PANEL.COMPONENTS;
        this.commands = constant.DEVICE_PANEL.COMMANDS;

        this.publicActions = function() {
            var actions = function(){};
            actions.prototype = {

                test: function() {
                    this.log('Testing...');
                }.bind(this)

            };
            return new actions();
        };

    }

    module.exports = PanelDevice;

}).call(this);
(function(undefined){

    var log     = require('../../log');
    var util    = require('../../util');
    var config  = require('../../config');
    var constant = require('../../constant');

    var Music = function() {

        this.is = 'AUDIO';
        this.components = constant.DEVICE_AUDIO;

        this.publicActions = function() {
            var actions = function(){};
            actions.prototype = {

                test: function() {
                    this.log('Testing...');
                }.bind(this),

                ledoff: function() {
                    this.log('Turn LED off');
                    this.sendCommand(constant.COMMANDS.LEDOFF);
                }.bind(this),

                ledred: function() {
                    this.log('Turn LED red');
                    this.sendCommand(constant.COMMANDS.LEDRED);
                }.bind(this),

                ledgreen: function() {
                    this.log('Turn LED green');
                    this.sendCommand(constant.COMMANDS.LEDGREEN);
                }.bind(this),

                ledblue: function() {
                    this.log('Turn LED blue');
                    this.sendCommand(constant.COMMANDS.LEDBLUE);
                }.bind(this),

                ledcyan: function() {
                    this.log('Turn LED blue');
                    this.sendCommand(constant.COMMANDS.LEDCYAN);
                }.bind(this),

                ledmagenta: function() {
                    this.log('Turn LED blue');
                    this.sendCommand(constant.COMMANDS.LEDMAGENTA);
                }.bind(this),

                ledyellow: function() {
                    this.log('Turn LED blue');
                    this.sendCommand(constant.COMMANDS.LEDYELLOW);
                }.bind(this),

                poweron: function() {
                    this.log('Power on audio...');
                    this.sendCommand(constant.COMMANDS.POWERON);
                }.bind(this),

                poweroff: function() {
                    this.log('Power off audio...');
                    this.sendCommand(constant.COMMANDS.POWEROFF);
                }.bind(this),

                muteon: function() {
                    this.log('Mute on audio...');
                    this.sendCommand(constant.COMMANDS.MUTEON);
                }.bind(this),

                muteoff: function() {
                    this.log('Mute off audio...');
                    this.sendCommand(constant.COMMANDS.MUTEOFF);
                }.bind(this),

                togglemute: function() {
                    this.log('Toggle mute audio...');
                    this.sendCommand(constant.COMMANDS.TOGGLEMUTE);
                }.bind(this),

                togglepower: function() {
                    this.log('Toggle power audio...');
                    this.sendCommand(constant.COMMANDS.TOGGLEPOWER);
                }.bind(this),

                volumeup: function() {
                    this.log('Volume up audio...');
                    this.sendCommand(constant.COMMANDS.VOLUMEUP);
                }.bind(this),

                volumedown: function() {
                    this.log('Volume down audio...');
                    this.sendCommand(constant.COMMANDS.VOLUMEDOWN);
                }.bind(this),

                play: function() {
                    this.sendCommand(constant.COMMANDS.MUTEOFF);
                    this.sendCommand(constant.COMMANDS.POWERON);
                }.bind(this)

            };
            return new actions();
        };

    }

    module.exports = Music;

}).call(this);
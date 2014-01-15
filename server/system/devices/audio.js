(function(undefined){

    var log     = require('../../log');
    var util    = require('../../util');
    var config  = require('../../config');
    var constant = require('../../constant');

    var AudioDevice = function() {

        this.is = 'AUDIO';

        this.commands = constant.DEVICE_AUDIO.COMMANDS;
        this.components = constant.DEVICE_AUDIO.COMPONENTS;
        this.activities = constant.DEVICE_AUDIO.ACTIVITIES;

        this.set('LED', 'OFF');
        this.set('POWER', 'OFF');
        this.set('MUTE', 'FALSE');
        this.set('ENABLED', 'FALSE');

        this.publicActions = function() {
            var actions = function(){};
            actions.prototype = {

                test: function() {
                    this.log('Testing...');
                }.bind(this),

                ledoff: function() {
                    this.log('Turn LED off...');
                    this.sendCommand(this.commands.LEDOFF);
                    this.set('LED', 'OFF');
                }.bind(this),

                ledblink: function() {
                    this.log('Make LED blink...');
                    this.sendCommand(this.commands.LEDBLINK);
                }.bind(this),

                ledcycle: function() {
                    switch(this.get('LED')) {
                        case 'RED':
                            this.actions.ledmagenta();
                            break;
                        case 'MAGENTA':
                            this.actions.ledblue();
                            break;
                        case 'BLUE':
                            this.actions.ledcyan();
                            break;
                        case 'CYAN':
                            this.actions.ledgreen();
                            break;
                        case 'GREEN':
                            this.actions.ledyellow();
                            break;
                        case 'YELLOW':
                        default:
                            this.actions.ledred();
                            break;
                    }
                }.bind(this),

                ledred: function() {
                    this.log('Turn LED red...');
                    this.sendCommand(this.commands.LEDRED);
                    this.set('LED', 'RED');
                }.bind(this),

                ledgreen: function() {
                    this.log('Turn LED green...');
                    this.sendCommand(this.commands.LEDGREEN);
                    this.set('LED', 'GREEN');
                }.bind(this),

                ledblue: function() {
                    this.log('Turn LED blue...');
                    this.sendCommand(this.commands.LEDBLUE);
                    this.set('LED', 'BLUE');
                }.bind(this),

                ledcyan: function() {
                    this.log('Turn LED cyan...');
                    this.sendCommand(this.commands.LEDCYAN);
                    this.set('LED', 'CYAN');
                }.bind(this),

                ledmagenta: function() {
                    this.log('Turn LED magenta...');
                    this.sendCommand(this.commands.LEDMAGENTA);
                    this.set('LED', 'MAGENTA');
                }.bind(this),

                ledyellow: function() {
                    this.log('Turn LED yellow...');
                    this.sendCommand(this.commands.LEDYELLOW);
                    this.set('LED', 'YELLOW');
                }.bind(this),

                poweron: function() {
                    this.log('Power on audio...');
                    this.sendCommand(this.commands.POWERON);
                }.bind(this),

                poweroff: function() {
                    this.log('Power off audio...');
                    this.sendCommand(this.commands.POWEROFF);
                }.bind(this),

                mute: function() {
                    this.log('Mute audio...');
                    this.sendCommand(this.commands.MUTEON);
                    this.set('MUTE', 'TRUE');
                }.bind(this),

                unmute: function() {
                    this.log('Unmute audio...');
                    this.sendCommand(this.commands.MUTEOFF);
                    this.set('MUTE', 'FALSE');
                }.bind(this),

                togglemute: function() {
                    this.log('Toggle mute audio...');
                    this.sendCommand(this.commands.TOGGLEMUTE);
                }.bind(this),

                togglepower: function() {
                    this.log('Toggle power audio...');
                    this.sendCommand(this.commands.TOGGLEPOWER);
                }.bind(this),

                volumeup: function() {
                    this.log('Volume up audio...');
                    this.sendCommand(this.commands.VOLUMEUP);
                }.bind(this),

                volumedown: function() {
                    this.log('Volume down audio...');
                    this.sendCommand(this.commands.VOLUMEDOWN);
                }.bind(this),

                play: function() {
                    this.sendCommand(this.commands.MUTEOFF);
                    this.sendCommand(this.commands.POWERON);
                }.bind(this)

            };
            return new actions();
        };

    }

    module.exports = AudioDevice;

}).call(this);
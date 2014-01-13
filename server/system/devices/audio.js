(function(undefined){

    var log     = require('../../log');
    var util    = require('../../util');
    var config  = require('../../config');
    var constant = require('../../constant');

    var AudioDevice = function() {

        this.is = 'AUDIO';
        this.components = constant.DEVICE_AUDIO;

        this.publicActions = function() {
            var actions = function(){};
            actions.prototype = {

                test: function() {
                    this.log('Testing...');
                }.bind(this),

                ledoff: function() {
                    this.log('Turn LED off...');
                    this.sendCommand(constant.COMMANDS.LEDOFF);
                }.bind(this),

                ledcycle: function() {
                    switch(this.get('COLOR')) {
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
                    this.sendCommand(constant.COMMANDS.LEDRED);
                    this.set('COLOR', 'RED');
                }.bind(this),

                ledgreen: function() {
                    this.log('Turn LED green...');
                    this.sendCommand(constant.COMMANDS.LEDGREEN);
                    this.set('COLOR', 'GREEN');
                }.bind(this),

                ledblue: function() {
                    this.log('Turn LED blue...');
                    this.sendCommand(constant.COMMANDS.LEDBLUE);
                    this.set('COLOR', 'BLUE');
                }.bind(this),

                ledcyan: function() {
                    this.log('Turn LED cyan...');
                    this.sendCommand(constant.COMMANDS.LEDCYAN);
                    this.set('COLOR', 'CYAN');
                }.bind(this),

                ledmagenta: function() {
                    this.log('Turn LED magenta...');
                    this.sendCommand(constant.COMMANDS.LEDMAGENTA);
                    this.set('COLOR', 'MAGENTA');
                }.bind(this),

                ledyellow: function() {
                    this.log('Turn LED yellow...');
                    this.sendCommand(constant.COMMANDS.LEDYELLOW);
                    this.set('COLOR', 'YELLOW');
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

    module.exports = AudioDevice;

}).call(this);
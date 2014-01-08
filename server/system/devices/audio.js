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

                poweron: function() {
                    this.log('Power on audio... (nonfunctional)');
                },

                poweroff: function() {
                    this.log('Power off audio... (nonfunctional)');
                },

                powertoggle: function() {
                    this.log('Power toggle audio... (nonfunctional)');
                },

                volumeup: function() {
                    this.log('Volume up audio... (nonfunctional)');
                },

                volumedown: function() {
                    this.log('Volume down audio... (nonfunctional)');
                }

            };
            return new actions();
        };

    }

    module.exports = Music;

}).call(this);
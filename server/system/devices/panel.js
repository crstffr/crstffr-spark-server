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
                }.bind(this)

            };
            return new actions();
        };

    }

    module.exports = Panel;

}).call(this);
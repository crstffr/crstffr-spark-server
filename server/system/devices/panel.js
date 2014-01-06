(function(undefined){

    var log     = require('../../log');
    var config  = require('../../config');
    var constant = require('../../constant');

    var Panel = function() {

        this.is = 'PANEL';
        this.components = constant.DEVICE_PANEL;

        this.test = function() {
            this.log('Testing the Panel');
        };

    }

    module.exports = Panel;

}).call(this);
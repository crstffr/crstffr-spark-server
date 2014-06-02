(function(undefined){

    var log = require('./utils/log').device;

    function Component(type) {
        this.type = type;
    }

    Component.prototype.command = function(cmd) {

        log("component command:", cmd);

    }

    Component.prototype.action = function(action) {

        log("component action:", action);

    }

    Component.prototype.status = function(info) {

        log("component status:", info);

    }

    module.exports = Component;

}).call(this);
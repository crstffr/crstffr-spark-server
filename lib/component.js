(function(undefined){

    var util = require('./utils/util');
    var log = require('./utils/log').device;

    function Component(type, node, interface) {

        this.type = type;
        this.node = node;
        this.interface = interface;
        this.actions = {};

        this.node.on('value', function(data){
            log(this.type, 'data changed', data.val());
        }.bind(this));

    }

    Component.prototype.when = function(attr, msg, fn) {
        if (!this.actions[attr]) {
            this.actions[attr] = {};
        }
        if (!this.actions[attr][msg]) {
            this.actions[attr][msg] = [];
        }
        this.actions[attr][msg].push(fn);
    }

    Component.prototype.sendCommand = function(cmd) {

        log("component command:", cmd);

    }

    Component.prototype.incomingAction = function(attr, msg) {

        attr = attr || '';

        log("action:", this.type, attr, msg);

        if (this.actions[attr]) {

            if (this.actions[attr][msg]) {

                if (this.actions[attr][msg].length > 0) {

                    for (var i = 0; i < this.actions[attr][msg].length; i++) {

                        if (util.isFunction(this.actions[attr][msg][i])) {

                            this.actions[attr][msg][i]();

                        }

                    }

                }

            }

        }

    }

    Component.prototype.updateStatus = function(attr, msg) {

        log("status:", this.type, attr, msg);

        var node = this.node.child(attr);

        if (!node) {
            this.node.set({attr: msg});
        } else {
            node.set(msg);
        }

    }

    module.exports = Component;

}).call(this);
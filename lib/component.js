(function(undefined){

    var equal = require('deep-equal');
    var util = require('./utils/util');
    var log = require('./utils/log').device;

    function Component(name, node, interface) {

        this.name = name;
        this.node = node;
        this.status = {};
        this.actions = {};
        this.interface = interface;

        this.node.on('value', function(status) {

            status = status.val();

            if (status && !equal(this.status, status)) {

                log(this.name, 'changed remotely, DO SOMETHING');
                this.status = status;
                this.update(status);
            }

        }.bind(this));

    }

    Component.prototype.update = function(status) {

    }

    Component.prototype.sendCommand = function(attr, cmd) {

        log('send command to device', this.name, attr, cmd);
        this.interface.send('command/' + this.name + '/' + attr, cmd);

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

    Component.prototype.incomingAction = function(attr, msg) {

        attr = attr || '';

        log(this.name, "action", attr, msg);

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

        log('> status', this.name, attr, msg);

        this.status[attr] = msg;

        var node = this.node.child(attr);

        if (!node) {
            this.node.set({attr: msg});
        } else {
            node.set(msg);
        }

    }

    module.exports = Component;

}).call(this);
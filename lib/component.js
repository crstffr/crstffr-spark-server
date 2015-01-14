(function(undefined){

    var equal = require('deep-equal');
    var util = require('./utils/util');
    var log = require('./utils/log').device;

    function Component(name, node, interface) {

        this.log = log;
        this.name = name;
        this.node = node;
        this.status = {};
        this.actions = {};
        this.interface = interface;

        // When there is a change in the database for this node
        // compare it to the current status in memory.  If it
        // is different, then trigger changes to the component.

        this.node.on('value', function(status) {
            status = status.val();

            if (status && equal(this.status, {})) {
                this.status = status;
            } else if (status && !equal(this.status, status)) {
                this.changed(status);
                this.status = status;
            }

        }.bind(this));

    }

    /**
     *
     * @param status
     */
    Component.prototype.changed = function(status) { }

    /**
     *
     */
    Component.prototype.reset = function() { }

    /**
     *
     * @param attr
     * @param cmd
     */
    Component.prototype.sendCommand = function(attr, cmd) {
        log('<', this.name, attr, cmd);
        this.interface.send('command/' + this.name + '/' + attr, cmd);
    };

    /**
     *
     * @param what
     * @param attr
     * @param msg
     */
    Component.prototype.incomingMessage = function(what, attr, msg) {

        switch (what) {
            case 'action':
                this.handleAction(attr, msg);
                break;
            case 'status':
                this.updateDatabase(attr, msg);
                break;
        }

    };

    /**
     *
     * @param attr
     * @param msg
     */
    Component.prototype.updateDatabase = function(attr, msg) {

        if (this.status[attr] !== msg) {
            log('> status', this.name, attr, msg);
            this.status[attr] = msg;
            this.node.update(this.status);
        }

    };

    /**
     *
     * @param attr
     * @param msg
     * @param fn
     */
    Component.prototype.when = function(attr, msg, fn, ctxt) {

        if (util.isFunction(msg)) {
            ctxt = fn;
            fn = msg;
            msg = '*';
        }

        ctxt = ctxt || this;

        if (!this.actions[attr]) {
            this.actions[attr] = {};
        }

        if (!this.actions[attr][msg]) {
            this.actions[attr][msg] = [];
        }

        this.actions[attr][msg].push(fn.bind(ctxt));
    };


    /**
     *
     * @param attr
     * @param msg
     */
    Component.prototype.handleAction = function(attr, msg) {

        attr = attr || '';

        log('>', this.name, attr, msg);

        if (this.actions[attr]) {

            var actions = this.actions[attr];
            var wildcard = actions['*'];
            var specific = actions[msg];

            // Fire wildcard handlers for this attribute.
            // Meaning when msg is of any value.

            if (wildcard && wildcard.length > 0) {
                for (var i = 0; i < wildcard.length; i++) {
                    var fn = wildcard[i];
                    if (util.isFunction(fn)) {
                        fn(msg);
                    }
                }
            }

            // Fire specific handlers for this attribute.
            // Meaning when msg is a specific value.

            if (specific && specific.length > 0) {
                for (var i = 0; i < specific.length; i++) {
                    var fn = specific[i];
                    if (util.isFunction(fn)) {
                        fn();
                    }
                }
            }

        }

    };

    module.exports = Component;

}).call(this);
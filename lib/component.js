(function(undefined){

    var equal = require('deep-equal');
    var util = require('./utils/util');
    var log = require('./utils/log').device;
    var Attribute = require('./attribute');

    function Component(name, node, interface) {

        this.log = log;
        this.name = name;
        this.node = node;
        this.attrs = {};
        this.actions = {};
        this.interface = interface;

    }

    /**
     *
     * @param {String} attr
     * @param {String} val
     */
    Component.prototype.changed = function(attr, val) { };

    /**
     *
     */
    Component.prototype.reset = function() { };


    /**
     *
     * @param {Array} attrs
     */
    Component.prototype.setAttrs = function(attrs) {

        if (!util.isArray(attrs)) {
            throw new Error('Component.setAttrs() expects an array');
        }

        // Iterate over each attr in the array and get an Attribute
        // instance for it (essentially creates new Attributes if
        // they don't already exist.

        attrs.forEach(this.getAttr.bind(this));

    };


    /**
     * Returns an Attribute object, either creating one if it doesn't
     * already exist, or returns the existing one if it does.
     *
     * @param {String} attr
     * @returns Attribute
     */
    Component.prototype.getAttr = function(attr) {

        var attrNode;

        if (!this.attrs[attr]) {
            attrNode = this.node.child(attr);
            this.attrs[attr] = new Attribute(attr, attrNode);
        }

        return this.attrs[attr];

    };


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
                this.getAttr(attr).set(msg);
                break;
        }

    };


    /**
     *
     * @param attr
     * @param msg
     * @param fn
     * @param [ctxt]
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

            var i, fn;
            var actions = this.actions[attr];
            var wildcard = actions['*'];
            var specific = actions[msg];

            // Fire wildcard handlers for this attribute.
            // Meaning when msg is of any value.

            if (wildcard && wildcard.length > 0) {
                for (i = 0; i < wildcard.length; i++) {
                    fn = wildcard[i];
                    if (util.isFunction(fn)) {
                        fn(msg);
                    }
                }
            }

            // Fire specific handlers for this attribute.
            // Meaning when msg is a specific value.

            if (specific && specific.length > 0) {
                for (i = 0; i < specific.length; i++) {
                    fn = specific[i];
                    if (util.isFunction(fn)) {
                        fn();
                    }
                }
            }

        }

    };

    module.exports = Component;

}).call(this);
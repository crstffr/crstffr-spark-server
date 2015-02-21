(function(undefined){

    var equal = require('deep-equal');
    var util = require('./utils/util');
    var log = require('./utils/log').device;

    function Attribute(name, node, interface) {

        this.log = log;
        this.name = name;
        this.node = node;
        this.value = "";
        this.readHandlers = [];
        this.changeHandlers = [];

        this.node.on('value', this.dbChanged.bind(this));

    }

    /**
     * When the value is changed in Firebase, check it against
     * our current attribute value.  If it differs, then trigger
     * the onChange handlers with this new value.
     *
     * @param snapshot
     */
    Attribute.prototype.dbChanged = function(snapshot) {
        var value = snapshot.val();
        this.read(value);
        if (value && this.value !== value) {
            this.changed(value);
            this.value = value;
        }
    };

    /**
     * Set the attribute value in the database
     * @param val
     */
    Attribute.prototype.set = function(val) {
        if (this.value !== val) {
            this.value = val;
            this.node.set(val);
        }
    };

    /**
     * Trigger the change handlers with a value
     * @param {String} val
     */

    Attribute.prototype.changed = function(val) {
        this.changeHandlers.forEach(function(fn) {
            fn(val);
        }.bind(this));
    };

    /**
     * Trigger the read handlers with a value
     * @param {String} val
     */
    Attribute.prototype.read = function(val) {
        this.readHandlers.forEach(function(fn) {
            fn(val);
        }.bind(this));
    };

    /**
     * Add a change handler onto the stack
     * @param fn
     * @param [ctxt]
     */
    Attribute.prototype.onChange = function(fn, ctxt) {
        if (util.isFunction(fn)) {
            this.changeHandlers.push(fn.bind(ctxt));
        }
    };

    /**
     * Add a read handler onto the stack
     * Read handlers are called any time the value of
     * the attribute is read from Firebase, regardless
     * of whether it's a new value
     * @param fn
     * @param [ctxt]
     */
    Attribute.prototype.onRead = function(fn, ctxt) {
        if (util.isFunction(fn)) {
            this.readHandlers.push(fn.bind(ctxt));
        }
    };

    module.exports = Attribute;

}).call(this);
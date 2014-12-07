(function(undefined) {

    var q = require('q');
    var interface = require('../services/communication');
    var log = require('../utils/log').server;

    var DeviceFactory = function() {

        this.devices = {};
        this.defers = {};

    }

    /**
     *
     * @param id
     * @param type
     */
    DeviceFactory.prototype.identify = function(who, what, comp, message) {

        var device = this.devices[who] || false;

        if (!device && what === 'action' && comp === 'identify') {

            log(who, 'identified as', message);
            return this.init(who, message);

        } else if (!device && what === 'action' && comp === 'network' && message === 'SYN') {

            log(who, 'is trying to connect but identity is unknown');
            interface.send(who, 'command/identify', '1');
            return false;

        }

    }

    /**
     *
     * @param id
     * @param type
     */
    DeviceFactory.prototype.init = function(id, type) {
        try {
            var SpecificDevice = require('../devices/' + type + 'Device');
            var device = new SpecificDevice(id);
            this.set(id, device);
        } catch(e) {
            log("Error loading library for device type:", type);
            log(e);
        }
    }

    /**
     *
     * @param id
     * @return {*}
     */
    DeviceFactory.prototype.get = function(id) {
        if (!this.defers[id]) {
            this.defers[id] = q.defer();
        }
        return this.defers[id].promise;
    }

    /**
     *
     * @param id
     * @return {*}
     */
    DeviceFactory.prototype.set = function(id, what) {
        this.devices[id] = what;
        if (!this.defers[id]) {
            this.defers[id] = q.defer();
        }
        this.defers[id].resolve(what);
        return what;
    }

    /**
     * Execute a function upon all devices.  First argument of
     * the callback is the device object.
     *
     * @param fn
     * @param ctxt
     */
    DeviceFactory.prototype.all = function(fn, ctxt) {
        ctxt = ctxt || this;
        Object.keys(this.devices).forEach(function(id){
            fn.bind(ctxt)(this.devices[id]);
        }.bind(this));

    }

    /**
     * Ask all devices to connect
     */
    DeviceFactory.prototype.connect = function() {
        interface.send('all', 'network/connect', '1');
    }

    /**
     * Ask all devices to disconnect and reset their component params
     */
    DeviceFactory.prototype.reset = function() {

        interface.send('all', 'network/disconnect', '1');

        this.all(function(device){
            log("RESET THIS DEVICE", device.id);
            device.reset();
        });

    }

    module.exports = new DeviceFactory();

}).call(this);
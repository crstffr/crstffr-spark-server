(function(undefined) {

    var interface = require('../services/communication');
    var log = require('../utils/log').server;

    var DeviceFactory = function() {

        this.devices = {};

    }

    /**
     *
     * @param id
     * @param type
     */
    DeviceFactory.prototype.identify = function(who, what, comp, message) {

        var device = this.get(who);

        if (!device && what === 'action' && comp === 'identify') {

            log(who, 'identified as', message);
            return this.init(who, message);

        } else if (!device) {

            log(who, 'is unknown, asking for identity');
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
        var SpecificDevice = require('../devices/' + type + 'Device');
        this.set(id, new SpecificDevice(id));
    }

    /**
     *
     * @param id
     * @return {*}
     */
    DeviceFactory.prototype.get = function(id) {
        return this.devices[id] || false;
    }

    /**
     *
     * @param id
     * @return {*}
     */
    DeviceFactory.prototype.set = function(id, what) {
        return this.devices[id] = what;
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
(function(undefined){

    var Interface = require('./services/interface');
    var database = require('./services/database');
    var util = require('./utils/util');
    var log = require('./utils/log').device;

    function Device(id) {

        this.id = id;
        this.log = log;
        this.type = '';
        this.components = {};
        this.configured = false;

        // Get device node from Firebase.
        this.node = database.devices.child(id);

        // Create an MQTT interface for this device
        this.interface = new Interface(this.id);

    }

    /**
     *
     */
    Device.prototype.continueSetup = function() {

        this.node.update({type: this.type});

        this.components.network.onConnect(function(){
            this.configure();
            this.getStatus();
        }.bind(this));

        this.components.network.onDisconnect(function(){
            this.log("DEVICE DISCONNECTED");
            this.reset();
        }.bind(this));

    };


    /**
     * Abstract function, usually overridden by child classes
     */
    Device.prototype.configure = function() {
        this.configured = true;
    };


    /**
     * Enable/disable extra MQTT logging for this device
     *
     * @param {Boolean} val
     */
    Device.prototype.debug = function (val) {
        var str = val ? 'true' : 'false';
        this.interface.send('setup/debug', str);
        log('< debug setting', str);
    };


    /**
     *
     * @param topic
     * @param [message]
     */
    Device.prototype.sendCommand = function(topic, message) {
        log('<', topic, message);
        this.interface.send('command/' + topic, message);
    };


    /**
     *
     */
    Device.prototype.getStatus = function() {
        this.sendCommand('status/all', '1');
    };


    /**
     *
     * @param type
     * @param component
     * @param attribute
     * @param message
     */
    Device.prototype.incomingMessage = function(type, component, attribute, message) {

        this.components.network.connected();

        if (type === 'log') {
            log('>', 'DEBUG:', component, attribute, message);
            return;
        }

        if (this.components[component]) {
            this.components[component].incomingMessage(type, attribute, message);
        }

    };

    Device.prototype.reset = function() {
        Object.keys(this.components).forEach(function(name) {
            this.components[name].reset();
        }.bind(this));
    };

    Device.prototype.getComponent = function(name) {
        return this.components[name];
    };

    /**
     *
     * @param components
     */
    Device.prototype.loadComponents = function(components) {

        var node;
        var component;
        var definition;

        // setup default components for every device

        components = util.extend({
            'network': {
                type: 'network'
            }
        }, components);

        // iterate over each component and initialize a new class
        // for it and add it to the device.components object.

        Object.keys(components).forEach(function(name) {

            definition = components[name];
            component = require('./components/' + definition.type);
            node = this.node.child('components/' + name);

            this.components[name] = new component(name, node, this.interface);

        }.bind(this));

        this.continueSetup();

    };

    module.exports = Device;

}).call(this);
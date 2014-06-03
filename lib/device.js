(function(undefined){

    var Interface = require('./services/interface');
    var data = require('./services/data');
    var log = require('./utils/log');

    function Device(id) {

        this.id = id;
        this.type = '';
        this.components = {};
        this.connected = false;
        this.configured = false;

        // Get device data from Firebase.
        this.data = data.devices.child(id);

        // Create an MQTT interface for this device
        this.interface = new Interface(this.id);

    }


    /**
     * Abstract function, usually overridden by child classes
     */
    Device.prototype.configure = function() {

    }


    /**
     *
     * @param topic
     * @param message
     */
    Device.prototype.sendCommand = function(topic, message) {

        switch (topic) {
            case 'connect':
                log.connection('<', topic, message);
                break;

            case 'keepalive':
                log.keepAlive('<', topic, message);
                break;

            default:
                log.device('<', topic, message);
                break;
        }

        this.interface.send('command/' + topic, message);

    }


    /**
     *
     * @param message
     */
    Device.prototype.incomingConnection = function(message) {

        switch (message){

            case 'SYN':
                this.sendCommand('connect', 'SYNACK');
                break;

            case 'ACK':
                if (!this.configured) {
                    this.configure();
                    this.configured = true;
                }
                this.connected = true;
                this.sendCommand('status/all', '1');
                break;

        }

    }


    /**
     *
     * @param component
     * @param what
     */
    Device.prototype.incomingAction = function(comp, attr, msg) {

        if (comp == 'connect') {
            log.connection('> connect', msg);
            this.incomingConnection(msg);
            return;
        }

        if (comp == 'keepalive' && msg == 'HI') {
            log.keepAlive('> keepalive', msg);
            this.sendCommand('keepalive', 'HO');
            return;
        }

        if (this.components[comp]) {
            this.components[comp].incomingAction(attr, msg);
            return;
        }

        log.device('>', comp, msg);

    }


    /**
     *
     * @param component
     * @param what
     */
    Device.prototype.incomingStatus = function(comp, attr, msg) {

        if (this.components[comp]) {
            this.components[comp].updateStatus(attr, msg);
        } else {
            log.device('status updated for uknown component', comp, attr, msg);
        }

    }


    /**
     *
     */
    Device.prototype.loadComponents = function(components) {

        var definition;
        var component;
        var node;

        Object.keys(components).forEach(function(name) {

            definition = components[name];
            component = require('./components/' + definition.type);
            node = this.data.child('components/' + name);
            this.components[name] = new component(name, node, this.interface);

        }.bind(this));

    }

    module.exports = Device;

}).call(this);
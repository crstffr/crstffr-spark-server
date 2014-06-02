(function(undefined){

    var data = require('./services/data');
    var interface = require('./interface');
    var log = require('./utils/log');

    function Device(id) {

        this.id = id;
        this.type = '';
        this.components = {};
        this.connected = false;
        this.configured = false;

    }

    /**
     * Abstract function, usually overridden by child classes
     */
    Device.prototype.configure = function() {

    }

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

        interface.send(this.id, 'command/' + topic, message);

    }

    Device.prototype.connect = function(message) {

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
                break;

        }

    }


    /**
     *
     * @param component
     * @param what
     */
    Device.prototype.action = function(who, what) {

        if (who == 'connect') {
            log.connection('>', who, what);
            this.connect(what);
            return;
        }

        if (who == 'keepalive' && what == 'HI') {
            log.keepAlive('>', who, what);
            this.sendCommand('keepalive', 'HO');
            return;
        }

        log.device('>', who, what);

        /*
        if (this.components[who]) {
            //this.components[component].action(what);
        }
        */

    }

    /**
     *
     * @param component
     * @param what
     */
    Device.prototype.status = function(component, what) {

        data.save(this.id, component, what);
        log.device("Status:", component, what);

    }

    /**
     *
     */
    Device.prototype.loadComponents = function(components) {

        var definition;
        var component;

        Object.keys(components).forEach(function(name) {

            definition = components[name];
            component = require('./components/' + definition.type);
            this.components[name] = new component();

        }.bind(this));

    }

    module.exports = Device;

}).call(this);
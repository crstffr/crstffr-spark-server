(function(undefined) {

    var interface = require('./services/communication');
    var log = require('./utils/log').router;

    var Router = function() {

        this.devices = {};

    }

    /**
     *
     * @param id
     * @param type
     */
    Router.prototype.initDevice = function(id, type) {
        var SpecificDevice = require('./devices/' + type);
        this.devices[id] = new SpecificDevice(id);
        return this.devices[id];
    }

    /**
     *
     * @param id
     * @return {*}
     */
    Router.prototype.getDevice = function(id) {
        return this.devices[id] || false;
    }

    /**
     *
     * @param id
     * @return {*}
     */
    Router.prototype.setDevice = function(id, what) {
        return this.devices[id] = what;
    }

    /**
     *
     * @param topic
     * @param message
     * @param packet
     */
    Router.prototype.parseMessage = function(topic, message, packet) {

        var parts = topic.split('/');

        /*
            Examples of topic parts

            pre   | who   | what          | comp      | attr          | message
            -------------------------------------------------
            /dev    /all   /connection      /server                     1
                    /{id}  /action          /identify                   audio
                    /{id}  /action          /enc                        up
                    /{id}  /command         /led        /power          off
                    /{id}  /command         /led        /color          red
                    /{id}  /command         /led        /brightness     10
                    /{id}  /status          /volume                     55
                    /{id}  /config          /enc                        quad-encoder

         */

        var pre = parts[0];
        var who = parts[1];
        var what = parts[2];
        var comp = parts[3];
        var attr = parts[4];
        var device = {};

        if (pre !== 'dev') { return; }

        if (who !== 'all') {

            device = this.getDevice(who);

            if (device === false && what === 'action' && comp === 'identify') {

                log('Device ' + who + ' identified as', message);
                device = this.initDevice(who, message);
                device.incomingConnection('SYN');

            } else if (device === false) {

                log("Unknown device", who);
                interface.send(who, 'command/identify', '1');
                return;

            } else {

                switch (what) {

                    case 'connect':
                        device.incomingConnection(message);
                        break;

                    case 'action':
                        if (comp == 'connect') {
                            log('> connect', message);
                            device.incomingConnection(message);
                        } else {
                            device.incomingAction(comp, attr, message);
                        }
                        break;

                    case 'status':
                        device.incomingStatus(comp, attr, message);
                        break;

                }

            }

        }

    }


    module.exports = new Router();

}).call(this);
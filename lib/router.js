(function(undefined) {

    var deviceFactory = require('./factories/deviceFactory');
    var log = require('./utils/log').router;

    var Router = function() {}

    /**
     *
     * @param topic
     * @param message
     * @param packet
     */
    Router.prototype.parseMessage = function(topic, message, packet) {

        var device = {};
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
                    /{id}  /status          /volume     /level          55
                    /{id}  /config          /enc                        quad-encoder

         */

        var pre = parts[0];     // topic prefix
        var who = parts[1];     // device id
        var what = parts[2];    // action || status
        var comp = parts[3];    // component name
        var attr = parts[4];    // component attribute

        if (pre !== 'dev' || who === 'all') { return; }

        device = deviceFactory.get(who);

        if (device) {

            device.incomingMessage(what, comp, attr, message);

        } else {

            deviceFactory.identify(who, what, comp, message);

        }

    }


    module.exports = new Router();

}).call(this);
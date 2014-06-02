(function(undefined){

    // Create an MQTT client

    // Create a Device object definition
        // spark device id
        // mqtt subscription

    // Loop over all devices in config

    // Setup mongoDB Mongoose

    var interface = require('./lib/interface').client;
    var spotimote = require('./lib/services/spotimote');
    var router = require('./lib/router');

    interface.subscribe('dev/+/action/#');
    interface.subscribe('dev/+/status/#');

    interface.on('message', router.parseMessage.bind(router));

    interface.publish('dev/all/connect', '1');

}).call(this);
(function(undefined) {

    var interface = require('./lib/services/communication').client;
    var database = require('./lib/services/database');
    var spotimote = require('./lib/services/spotimote');
    var webserver = require('./lib/services/webserver');
    var devices = require('./lib/factories/deviceFactory');
    var router = require('./lib/router');
    var util = require('./lib/utils/util');
    var log = require('./lib/utils/log');


    function Server() {

        process.on('SIGINT', _exitHandler.bind(this));
        process.on('SIGTERM', _exitHandler.bind(this));
        process.on('uncaughtException', _exitHandler.bind(this));

        interface.on('connect', function() {
            log.server('Interface connected');
            interface.subscribe('dev/+/action/#');
            interface.subscribe('dev/+/status/#');
            devices.connect();
        });

        interface.on('error', function(err) {
            log.server('MQTT Error:', err);
        });

        interface.on('message', router.parseMessage.bind(router));

        database.server.update({online: 'true'});

    }

    function _exitHandler(options, err) {

        log.server("SERVER SHUTTING DOWN");

        if (err) {
            console.log(err.stack);
            process.exit();
        }

        database.server.update({
            online: 'false',
            lastOnline: util.now()
        });

        devices.reset();

        setTimeout(process.exit, 500);
    }

    module.exports = new Server();

}).call(this);
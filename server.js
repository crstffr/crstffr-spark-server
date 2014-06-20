(function(undefined) {

    var interface = require('./lib/services/communication').client;
    var database = require('./lib/services/database');
    var spotimote = require('./lib/services/spotimote');
    var webserver = require('./lib/services/webserver');
    var devices = require('./lib/factories/deviceFactory');
    var router = require('./lib/router');
    var util = require('./lib/utils/util');


    function Server() {

        process.on('exit', _exitHandler.bind(this));
        process.on('SIGINT', _exitHandler.bind(this));
        process.on('uncaughtException', _exitHandler.bind(this));

        interface.on('connect', function() {
            interface.subscribe('dev/+/action/#');
            interface.subscribe('dev/+/status/#');
            devices.connect();
        });

        interface.on('message', router.parseMessage.bind(router));

        database.server.update({online: 'true'});
    }

    function _exitHandler(options, err) {
        if (err) {
            console.log(err.stack);
            process.exit();
        }
        devices.disconnect();
        database.server.update({
            online: 'false',
            lastOnline: util.now()
        });
        setTimeout(process.exit, 100);
    }

    module.exports = new Server();

}).call(this);
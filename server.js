(function(undefined){

    var interface = require('./lib/services/communication').client;
    var spotimote = require('./lib/services/spotimote');
    var webserver = require('./lib/services/webserver');
    var router = require('./lib/router');

    interface.subscribe('dev/+/action/#');
    interface.subscribe('dev/+/status/#');
    interface.on('message', router.parseMessage.bind(router));
    interface.publish('dev/all/connect', '1');

}).call(this);
(function(undefined) {

    var util  = require('./util');
    var moment = require('moment');

    function _log(str, args) {
        str = moment().format('hh:mm:ssA') + ' ' + str;
        console.log.apply(console, util.prependArgs(str, args));
    }

    module.exports = {

        server: function() {
            if (util.debug('server')) {
                _log('SERVER   -', arguments);
            }
        },

        debug: function() {
            if (util.debug('debug')) {
                _log('DEBUG    -', arguments);
            }
        },

        behavior: function() {
            if (util.debug('behavior')) {
                _log('BEHAVIOR -', arguments);
            }
        },

        router: function() {
            if (util.debug('router')) {
                _log('ROUTER   -', arguments);
            }
        },

        remote: function() {
            _log('REMOTE   -', arguments);
        },

        local: function() {
            _log('LOCAL    -', arguments);
        },

        user: function() {
            if (util.debug('user')) {
                _log('USER     -', arguments);
            }
        },

        device: function() {
            if (util.debug('device')) {
                _log('DEVICE   -', arguments);
            }
        },

        spotimote: function() {
            if (util.debug('spotify')) {
                _log('SPOTIFY  -', arguments);
            }
        },

        core: function() {
            if (util.debug('core')) {
                _log('CORE     -', arguments);
            }
        },

        connection: function() {
            if (util.debug('connection')) {
                _log('CONNECT  -', arguments);
            }
        },

        keepAlive: function() {
            if (util.debug('keepAlive')) {
                _log('KEEPALIVE-', arguments);
            }
        }

    };

}).call(this);


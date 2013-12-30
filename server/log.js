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
                _log('SERVER -', arguments);
            }
        },

        remote: function() {
            _log('REMOTE -', arguments);
        },

        local: function() {
            _log('LOCAL  -', arguments);
        },

        device: function() {
            if (util.debug('device')) {
                _log('DEVICE -', arguments);
            }
        },

        music: function() {
            if (util.debug('music')) {
                _log('MUSIC  -', arguments);
            }
        },

        core: function() {
            if (util.debug('core')) {
                _log('CORE   -', arguments);
            }
        },

        tcp: function() {
            if (util.debug('tcp')) {
                _log('TCP    -', arguments);
            }
        },

        tcpKeepAlive: function() {
            if (util.debug('keepAlive')) {
                _log('TCP    -', arguments);
            }
        }

    };

}).call(this);


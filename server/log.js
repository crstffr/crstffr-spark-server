(function(undefined) {

    var moment = require('moment');
    var utils  = require('./utils.js');

    function _log(str, args) {
        str = moment().format('hh:mm:ssA') + ' ' + str;
        console.log.apply(console, utils.prependArgs(str, args));
    }

    module.exports = {

        server: function() {
            _log('SERVER -', arguments);
        },

        remote: function() {
            _log('REMOTE -', arguments);
        },

        local: function() {
            _log('LOCAL  -', arguments);
        },

        music: function() {
            _log('MUSIC  -', arguments);
        },

        core: function() {
            _log('CORE   -', arguments);
        }

    };

}).call(this);


(function(undefined) {

    var util  = require('./util');
    var moment = require('moment');

    function _log(str, args) {
        str = moment().format('hh:mm:ssA') + ' ' + str;
        console.log.apply(console, util.prependArgs(str, args));
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

        device: function() {
            _log('DEVICE -', arguments);
        },

        music: function() {
            _log('MUSIC  -', arguments);
        },

        core: function() {
            _log('CORE   -', arguments);
        },

        tcp: function() {
            _log('TCP    -', arguments);
        }

    };

}).call(this);


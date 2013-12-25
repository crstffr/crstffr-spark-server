(function(undefined){

    var os = require('os');
    var moment = require('moment');

    module.exports = {

        now: function() {
            return moment().unix();
        },

        getIP: function() {
            var ip = null;
            var ifs = os.networkInterfaces();
            for (var ifName in ifs) {
                if (!ip) {
                    ifs[ifName].forEach(function (iface) {
                        if (!ip && !iface.internal && 'IPv4' === iface.family) {
                            ip = iface.address;
                        }
                    });
                }
            }
            return ip;
        },

        prependArgs: function(string, args) {
            args = Array.prototype.slice.call(args, 0);
            args.unshift(string);
            return args;
        }

    }

}).call(this);
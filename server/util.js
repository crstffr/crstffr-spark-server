(function(undefined){

    var os = require('os');
    var util = require('util');
    var xtend = require('xtend');
    var moment = require('moment');
    var microtime = require('microtime');

    function Util() {}

    Util.prototype = {

        __proto__: util,

        extend: xtend,

        noop: function(){},

        inherits : function(sub, sup, proto) {
            util.inherits(sub, sup);
            if (typeof proto !== 'undefined') {
                Object.keys(proto).forEach(function(key) {
                    sub.prototype[key] = proto[key];
                });
            }
        },

        now: function() {
            return moment().unix();
        },

        micronow: function() {
            return microtime.now();
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

    module.exports = new Util();

}).call(this);
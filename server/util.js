(function(undefined){

    var os = require('os');
    var util = require('util');
    var xtend = require('xtend');
    var moment = require('moment');
    var microtime = require('microtime');
    var config = require('./config');

    function Util() {}

    Util.prototype = {

        __proto__: util,

        extend: xtend,

        noop: function(){},

        isNumber: function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        toNumber: function(n) {
            if (this.isInt(n)) {
                return parseInt(n);
            } else if (this.isFloat(n)) {
                return parseFloat(n).toPrecision(2);
            } else {
                return 0;
            }
        },

        isInt: function(n) {
            return (this.isNumber(n) && n.indexOf('.') < 0);
        },

        isFloat: function(n) {
            return (this.isNumber(n) && n.indexOf('.') > 0);
        },

        isFunction: function(func) {
            return typeof func == 'function';
        },

        debug: function(who) {
            var level = config.logLevel;
            var pos = level.indexOf(who);
            if (pos > -1 && level.substr(pos-1,1) == '-') {
                return false;
            } else if (pos > -1 || level.indexOf('all') > -1) {
                return true;
            }
        },

        uid: function() {
            return this.micronow() + ":" + Math.floor(Math.random()*1000);
        },

        inherits : function(sub, sup, proto) {
            util.inherits(sub, sup);
            if (typeof proto !== 'undefined') {
                Object.keys(proto).forEach(function(key) {
                    sub.prototype[key] = proto[key];
                });
            }
        },

        msReadable: function(ms) {
            var secs, mins, hours, days;
            secs = ms / 1000;
            if (secs < 60) {
                return parseFloat(secs).toFixed(2) + ' seconds';
            } else {
                mins = secs / 60;
                if (mins < 60) {
                    return parseFloat(mins).toFixed(2) + ' minutes';
                } else {
                    hours = mins / 60;
                    if (hours < 24) {
                        return parseFloat(hours).toFixed(2) + ' hours';
                    } else {
                        days = hours / 24;
                        return parseFloat(days).toFixed(2) + ' days';
                    }
                }
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
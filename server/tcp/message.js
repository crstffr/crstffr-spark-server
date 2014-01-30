(function(undefined){

    var Q       = require('q');
    var log     = require('../log');
    var hex     = require('../hex');
    var util    = require('../util');
    var config  = require('../config');
    var constant= require('../constant');
    var emitter = require('events').EventEmitter;

    var TCPMessage = function() {

        emitter.call(this);

        this._buffer = '';
        this._deferred = Q.defer();

        this.data = {};
        this.uid = util.uid();
        this.finished = false;
        this.whenComplete = this._deferred.promise;

    };

    util.inherits(TCPMessage, emitter, {

        trim: function(string) {
            return string.replace(hex.STX ,'')
                         .replace(hex.EOT ,'');
        },

        wait: function() {
            this._timeout = setTimeout(this.timeout.bind(this), config.tcp.msgTimeout);
            return this;
        },

        timeout: function() {
            this._deferred.reject('timeout');
            this.finished = true;
        },

        append: function(data) {

            this._buffer += data;

            // Keep alive response bit, consider
            // it a complete message all by itself
            // without parsing anything.

            if (data === hex.ACK) {
                clearTimeout(this._timeout);
                this._deferred.resolve(data);
                this.finished = true;
            }

            if (data[data.length-1] === hex.EOT) {
                clearTimeout(this._timeout);
                this.data = this.parse(this._buffer);
                this._deferred.resolve(this.data);
                this.finished = true;
            }

        },

        parse: function(string) {

            // Messages are formatted as such
            //
            // [STX] <WHO> [ETX] <WHAT> [ETB] <HAS_VALUE> [EOT]
            //
            // IF <WHAT> is an activity, <HAS_VALUE> is null
            // IF <WHAT> is "=", <HAS_VALUE> should be populated


            string = this.trim(string);

            var part1, part2, data;
            var ETX = string.indexOf(hex.ETX);
            var EQ  = string.indexOf('=');

            if (EQ >= 0) {

                part1 = hex.strip(string.substr(0, EQ));
                part2 = hex.strip(string.substr(EQ+1));

                data = {
                    who:   util.isNumber(part1) ? util.toNumber(part1) : part1,
                    value: util.isNumber(part2) ? util.toNumber(part2) : part2
                };

            } else {

                part1 = hex.strip(string.substr(0, ETX));
                part2 = hex.strip(string.substr(ETX+1));

                data = {
                    who:  util.isNumber(part1) ? util.toNumber(part1) : part1,
                    what: util.isNumber(part2) ? util.toNumber(part2) : part2
                };

            }

            console.log(string, data);

            return data;

        }

    });

    module.exports = TCPMessage;

}).call(this);
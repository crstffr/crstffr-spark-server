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
            // [STX] <WHO> [ETX] <WHAT> [DLE] <HAS_VALUE> [EOT]
            //

            // @TODO: maybe change DLE because it seems weird

            string = this.trim(string);

            var ETX = string.indexOf(hex.ETX);
            var DLE = string.indexOf(hex.DLE);

            var part1 = hex.strip(string.substr(0, ETX));
            var part2 = hex.strip(string.substr(ETX+1, DLE));
            var part3 = hex.strip(string.substr(DLE+1));

            part1 = util.isNumber(part1) ? util.toNumber(part1) : part1;
            part2 = util.isNumber(part2) ? util.toNumber(part2) : part2;
            part3 = util.isNumber(part3) ? util.toNumber(part3) : part3;

            var data  = {
                who:   part1,
                what:  part2,
                value: part3
            };

            // console.log(string, data);

            return data;

        }

    });

    module.exports = TCPMessage;

}).call(this);
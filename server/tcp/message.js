(function(undefined){

    var Q       = require('q');
    var log     = require('../log');
    var hex     = require('../hex');
    var util    = require('../util');
    var config  = require('../config');
    var constant= require('../constant');
    var emitter = require('events').EventEmitter;

    /*
    var H1 = hex.BEL;
    var H2 = hex.STX;
    var H3 = hex.STX;
    var H4 = hex.EOT;
    */

    var TCPMessage = function() {

        emitter.call(this);

        this._buffer = '';
        this._deferred = Q.defer();

        this.data = {};
        this.finished = false;
        this.whenComplete = this._deferred.promise;

    };

    util.inherits(TCPMessage, emitter, {

        trim: function(string) {
            return string.replace(hex.STX ,'')
                         .replace(hex.EOT ,'');
        },

        wait: function() {
            log.tcp('Waiting for a message for', config.tcp.msgTimeout / 1000, 'seconds');
            this._timeout = setTimeout(this.timeout.bind(this), config.tcp.msgTimeout);
            return this;
        },

        timeout: function() {
            this._deferred.reject('timeout');
            this.finished = true;
        },

        append: function(data) {

            this._buffer += data;

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
            // [STX] <WHO> [ETX] <DID_WHAT> [EOT]
            //

            string = this.trim(string);

            var STX = string.indexOf(hex.STX);
            var ETX = string.indexOf(hex.ETX);

            var type  = string[0];
            var part1 = string.substr(0,ETX);
            var part2 = string.substr(ETX+1);

            var data  = {
                who:part1,
                what:part2,
                when:util.now()
            };

            return data;

        }

    });

    module.exports = TCPMessage;

}).call(this);
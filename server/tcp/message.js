(function(undefined){

    var log     = require('../log');
    var hex     = require('../hex');
    var util    = require('../util');
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

        this.type = 0;
        this.data = {};
        this.buffer = '';
        this.string = '';

    };

    util.inherits(TCPMessage, emitter, {

        trim: function(string) {
            return string.replace(hex.BEL ,'')
                         .replace(hex.EOT ,'');
        },

        strip: function(string) {
            return string.replace(hex.SOH ,'')
                         .replace(hex.STX ,'')
                         .replace(hex.ETX ,'')
                         .replace(hex.BEL ,'')
                         .replace(hex.EOT ,'');
        },

        append: function(data) {

            this.buffer += data;

            if (data[data.length-1] === hex.EOT) {
                this.data = this.parse(this.buffer);
                log.local(this.data);
                this.emit('complete', this.data);
            }

        },

        parse: function(string) {

            // Messages are formatted as such
            //
            // [BEL] <MSG_TYPE> [STX] <WHO_OR_COMMAND> [ETX] <DID_WHAT> [EOT]
            //

            string = this.trim(string);

            var STX = string.indexOf(hex.STX);
            var ETX = string.indexOf(hex.ETX);

            var type  = string[0];
            var part1 = string.substr(STX+1,ETX);
            var part2 = string.substr(ETX+1);

            var data  = {};

            switch (type) {
                case constant.TCP_MESSAGE_TYPE_ACTION:
                    data = {
                        who:  part1,
                        what: part2,
                        when: util.now()
                    }
                    break;
            }

            return data;

        }

    });

    module.exports = TCPMessage;

}).call(this);
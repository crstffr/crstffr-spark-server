(function(undefined){

    var log     = require('../../log');
    var util    = require('../../util');
    var config  = require('../../config');
    var constant = require('../../constant');

    var emitter = require('events').EventEmitter;

    var Music = function() {

        emitter.call(this);
        this.is = "MUSIC";

    }

    util.inherits(Music, emitter, {

        powerOn: function() {

        },

        powerOff: function() {

        },

        volumeUp: function() {

        },

        volumeDown: function() {

        }

    });

    module.exports = Music;

}).call(this);
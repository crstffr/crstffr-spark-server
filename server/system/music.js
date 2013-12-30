(function(undefined){

    var log     = require('../log');
    var util    = require('../util');
    var config  = require('../config');
    var constant = require('../constant');
    var spotimote = require('../lib/spotimote');
    var emitter = require('events').EventEmitter;

    var Music = function() {

        emitter.call(this);
        this.spotify = new spotimote(config.spotimote);

    }

    util.inherits(Music, emitter, {

        playPause: function() {

        },

        skipForward: function() {

        },

        skipBackward: function() {

        },

        volumeUp: function() {

        },

        volumeDown: function() {

        },

        loadPlaylist: function() {

        },

        startRadio: function() {

        }

    });

    module.exports = new Music();

}).call(this);
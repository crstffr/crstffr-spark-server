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

        log: function() {
            log.music.apply(log, arguments);
        },

        playPause: function() {
            this.log('Play/Pause');
        },

        skipForward: function() {
            this.log('Skip Forward');
        },

        skipBackward: function() {
            this.log('Skip Backward');
        },

        volumeUp: function() {
            this.log('Global Volume Up');
        },

        volumeDown: function() {
            this.log('Global Volume Down');
        },

        loadPlaylist: function() {

        },

        startRadio: function() {

        }

    });

    module.exports = new Music();

}).call(this);
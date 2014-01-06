(function(undefined) {

    var log = require('../log');
    var util = require('../util');
    var config = require('../config');
    var constant = require('../constant');
    var spotimote = require('../lib/spotimote');
    var emitter = require('events').EventEmitter;

    var Music = function() {

        emitter.call(this);
        this.spotify = new spotimote(config.spotimote);
        this.actions = this.publicActions();

    }

    util.inherits(Music, emitter, {

        log: function() {
            log.music.apply(log, arguments);
        },

        execute: function(command) {
            command = command.toLowerCase();
            if (util.isFunction(this.actions[command])) {
                this.actions[command]();
            }
        },

        publicActions: function() {

            var actions = function(){};

            actions.prototype = {

                playpause: function() {
                    this.spotify.playPause();
                }.bind(this),

                skipforward: function() {
                    this.spotify.skipForward();
                }.bind(this),

                skipbackward: function() {
                    this.spotify.skipBackward();
                }.bind(this),

                volumeup: function() {
                    this.spotify.volumeUp();
                }.bind(this),

                volumedown: function() {
                    this.spotify.volumeDown();
                }.bind(this),

                randomradio: function() {
                    this.spoty.randomRadio();
                }.bind(this)

            };

            return new actions();

        }

    });

    module.exports = new Music();

}).call(this);
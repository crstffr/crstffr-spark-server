
(function(undefined){

    var log = require('./log.js');
    var config = require('./config.js');
    var spotimote = require('./spotimote.js');
    var spotify = new spotimote(config.spotimote);

    module.exports = {

        process: function(data) {

            log.core(spark.id(data.who), data.what);

            if (data.what === 'BTN1PRESSED') {
                spotify.playPause();
            }

        },

        validate: function(data) {

        },

        parse: function() {

        },

        loopkup: function() {

        },

        trigger: function() {

        }

    }

}).call(this);

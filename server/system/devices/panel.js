(function(undefined){

    var log     = require('../../log');
    var util    = require('../../util');
    var config  = require('../../config');
    var constant = require('../../constant');
    var music   = require('../music');
    var emitter = require('events').EventEmitter;

    var Panel = function() {

        emitter.call(this);
        this.is = 'PANEL';
        this.components = constant.DEVICE_PANEL;

        this.dispatch = function(signal) {

            switch (signal.who) {

                case this.components.BTN2:
                    music.playPause();
                    break;

                case this.components.BTN1:
                    music.skipForward();
                    break;

                case this.components.KNOB:
                    switch (signal.what) {
                        case constant.ACTION_UP:
                            music.volumeUp();
                            break;
                        case constant.ACTION_DOWN:
                            music.volumeDown();
                            break;
                    }
                    break;

            }

        }

    }

    module.exports = Panel;

}).call(this);
(function(undefined){

    var log     = require('../../log');
    var util    = require('../../util');
    var config  = require('../../config');
    var constant = require('../../constant');
    var music   = require('../music');

    var emitter = require('events').EventEmitter;

    var Panel = function() {

        emitter.call(this);
        this.is = "PANEL";
        this.components = constant.DEVICE_PANEL;

    }

    util.inherits(Panel, emitter, {

        dispatch: function(signal){

            log.device('dispatch here');
            this.log('dispatch also here');

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
                            this.log('KNOB UP');
                            break;
                        case constant.ACTION_DOWN:
                            this.log('KNOB DOWN');
                            break;
                    }
                    break;

            }

        }

    });

    module.exports = Panel;

}).call(this);
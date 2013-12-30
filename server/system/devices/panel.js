(function(undefined){

    var log     = require('../../log');
    var util    = require('../../util');
    var config  = require('../../config');
    var constant = require('../../constant');

    var emitter = require('events').EventEmitter;

    var Panel = function() {

        emitter.call(this);
        this.is = "PANEL";

    }

    util.inherits(Panel, emitter, {

        writeInfo: function() {

        }

    });

    module.exports = Panel;

}).call(this);
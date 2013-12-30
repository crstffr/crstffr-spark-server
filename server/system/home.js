(function(undefined){

    var log     = require('../../log');
    var util    = require('../../util');
    var config  = require('../../config');
    var constant = require('../../constant');
    var emitter = require('events').EventEmitter;
    var room    = require('./room');

    var Home = function(id) {

        emitter.call(this);
        this.id = id;

    }

    util.inherits(Home, emitter, {



    });

    module.exports = Home;

}).call(this);
(function(undefined){

    var log     = require('../log');
    var util    = require('../util');
    var config  = require('../config');
    var constant = require('../constant');
    var emitter = require('events').EventEmitter;

    var User = function(id) {

        emitter.call(this);

        this.id = id;
        this.config = config.structure.users[id];

        this.homes = {};
        this.rooms = {};
        this.devices = {};

    }

    util.inherits(User, emitter, {


    });

    module.exports = User;

}).call(this);
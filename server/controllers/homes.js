
(function(undefined){

    var log     = require('../log');
    var util    = require('../util');
    var config  = require('../config');
    var user    = require('../system/user');
    var emitter = require('events').EventEmitter;

    var Users = function() {
        emitter.call(this);
        this.container = {};
        this.timeout = false;
        this.init();
    };

    util.inherits(Users, emitter, {
        init: function() {
            var id, dev;
            var users = config.structure.users;
            for (var usr in users) {
                if (users.hasOwnProperty(usr)) {
                    this.container[usr] = new user(usr);
                }
            }
        }
    });

    module.exports = new Users();

}).call(this);

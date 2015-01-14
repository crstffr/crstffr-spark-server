(function(undefined){

    var Firebase = require('firebase');
    var webserver = require('./webserver');
    var config = require('../../config');

    var Database = function() {

        this.root = new Firebase(config.firebase.root);
        this.user = this.root.child(config.user);
        this.home = this.user.child(config.home);
        this.server = this.home.child('server');
        this.devices = this.home.child('devices');
        this.rooms = this.home.child('rooms');

    };

    module.exports = new Database();

}).call(this);
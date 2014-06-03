(function(undefined){

    var client = require('./communication').client;

    var Interface = function(id) {

        this.id = id;

    }

    Interface.prototype.send = function(topic, message) {

        client.publish('dev/' + this.id + '/' + topic, message.toString());

    }

    module.exports = Interface;

}).call(this);
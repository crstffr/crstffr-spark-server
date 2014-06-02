(function(undefined){

    var mqtt = require('mqtt');

    var Interface = function() {

        this.client = mqtt.createClient(1883, 'localhost');

    }

    Interface.prototype.send = function(id, topic, message) {

        this.client.publish('dev/' + id + '/' + topic, message.toString());

    }

    module.exports = new Interface();

}).call(this);
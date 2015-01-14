(function(undefined){

    var mqtt = require('mqtt');

    var Communication = function() {

        this.client = mqtt.createClient(1883, 'localhost', {
            will: {
                qos: 1,
                payload: '1',
                retain: false,
                topic: 'dev/all/network/disconnect'
            }
        });

    };

    Communication.prototype.send = function(id, topic, message) {

        this.client.publish('dev/' + id + '/' + topic, message.toString());

    };

    module.exports = new Communication();

}).call(this);
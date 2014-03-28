(function(undefined) {

    var ip = require('ip');
    var mqtt = require('mqtt');
    var util = require('./server/util');
    var config = require('./server/config');
    var prefix = 'dev/48ff6b065067555039091087/';

    client = mqtt.createClient(1883, 'localhost');

    client.subscribe('#');

    client.on('message', function(topic, message, packet) {

        console.log(topic.substr(29), message);

        if (topic == prefix + 'action/configure') {
            if (message == 'true') {
                client.publish(prefix + 'setup/debug', 'false');
                client.publish(prefix + 'setup/default/radio/station', '879');
                client.publish(prefix + 'control/radio/station', '879');
                client.publish(prefix + 'control/radio/volume', '15');
                client.publish(prefix + 'setup/led/max/intensity', '100');
                client.publish(prefix + 'control/led/intensity', '2');
                client.publish(prefix + 'control/led/color', 'orange');
            }
        }

        if (topic == prefix + 'action/connected') {
            if (message == 'true') {
                client.publish(prefix + 'control/power', 'on');
            }
        }

        if (topic == prefix + 'action/button/enc') {
            if (message == 'press') {
                client.publish(prefix + 'control/power', 'toggle');
            }
        }

        if (topic == prefix + 'action/button/led') {
            if (message == 'press') {
                client.publish(prefix + 'control/led/dim', '1');
            }
        }

        if (topic == prefix + 'action/button/misc') {
            if (message == 'press') {
                client.publish(prefix + 'control/radio', 'skip');
            }
        }

    });

    console.log("Server on: " + ip.address());

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(chunk) {

        var chunk = chunk.trim();
        var parts = chunk.split(' ');
        var topics = parts[0].split('/');

        if (topics[0] == 'setup') {
            client.publish(prefix + parts[0], parts[1], {qos: 1});
        } else {
            client.publish(prefix + 'control/' + parts[0], parts[1], {qos: 1});
        }

        // power on
        // power off

        // led red
        // led yellow
        // led green

        // volume low
        // volume med
        // volume high
        // volume 25

        // radio/station 879
        // radio/station 893

        // radio/volume 8
        // radio/volume 10
        // radio/volume 12


    }.bind(this));

    /*
    var sys = require('sys')
    var exec = require('child_process').exec;
    function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec("spark function list", puts);
    */

}).call(this);
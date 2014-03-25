(function(undefined) {

    var ip = require('ip');
    var util = require('./server/util');
    var config = require('./server/config');

    var mqtt = require('mqtt');

    client = mqtt.createClient(1883, 'localhost');

    client.subscribe('#');

    client.on('message', function(topic, message, packet) {
        console.log(topic, message);
    });

    console.log("Server on: " + ip.address());

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(chunk) {

        var chunk = chunk.trim();
        var parts = chunk.split(" ");

        client.publish('dev/48ff6b065067555039091087/control/' + parts[0], parts[1], {qos: 1});

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
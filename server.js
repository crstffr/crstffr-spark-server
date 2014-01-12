
(function(undefined){

    var util    = require('./server/util');
    var tcp     = require('./server/tcp/server');
    var user    = require('./server/system/user');
    var router  = require('./server/router');
    var config  = require('./server/config');

    // ***********************************************
    // Let's start some shit!
    // ***********************************************

    var user = new user(config.thisUser);
    var devices = user.deviceManager();
    var server = new tcp(devices);
    var router = new router(user);

    // ***********************************************
    // Define our behaviors
    // ***********************************************

    [
        //'any panel knob press; playpause music',
        //'any panel knob turncw; volumeup audio in room',
        //'any panel knob turnccw; volumedown audio in room',

        //'any panel btn1 press; ledoff audio in room',

//        'any panel knob press; ledblue audio in room',
        'any panel knob turncw; ledmagenta audio in room',
        'any panel knob turnccw; ledblue audio in room',

        'any panel knob turncw; muteoff audio in room',
        'any panel knob turnccw; muteon audio in room',
        'any panel btn1 press; togglepower audio in room',

        'any audio btn1 press; ledoff audio in room',
        'any audio power off; ledoff audio in room',

        'any audio power on; ledgreen audio in room',
        'any audio power off; ledoff audio in room',
        'any audio power off; muteoff audio in room'


        //'device control1 knob press; test control1'

        //'office panel btn1 press; skipforward music',
        //'kitchen panel btn1 press; randomradio music'
        //'any panel pir motion and motion enabled in home; play audio in room',


        /* // Test action on device by it's NAME
        'any panel btn1 press; test ctrl1 in room',
        'any panel btn1 press; test ctrl1 in office',
        'any panel btn1 press; test ctrl1 in kitchen',
        'any panel btn1 press; test ctrl1 in home',
        */

        /* // Test action on device by it's TYPE
        'any panel btn1 press; test panel in room',
        'any panel btn1 press; test panel in office',
        'any panel btn1 press; test panel in kitchen',
        'any panel btn1 press; test panel in home',
        */

        /*
        'any panel btn1 press; powertoggle audio in room',
        'any panel btn1 presshold; poweroff audio in home and set motion disabled in home',

        'any panel btn1 press; skipforward music',
        'any panel btn1 presshold; randomradio music',



        'any panel btn2 press and motion is disabled in home; set motion enabled in home',
        'any panel btn2 press and motion is enabled in home; set motion disabled in home'
        */

        // Future behavior ideas
        //'any panel pir motion and motion is enabled in home; poweron audio in room',
        //'any panel pir motion and light is dark in room; poweron light in room'

    ].forEach(function(behavior){
        router.registerBehavior(behavior);
    });

    // ***********************************************
    // Setup some stateful defaults
    // ***********************************************

    user.home.set('LIGHT', 'DARK');
    user.home.set('MOTION', 'DISABLED');

    // ***********************************************
    // In a moment, let's connect ALL the things!
    // ***********************************************

    setTimeout(function(){
        devices.connectAll();
    }.bind(this), 250);

    // ***********************************************
    // I hear you man, and let me respond.
    // ***********************************************

    server.on('signalReceived', function(device, signal){
        router.parseSignal(device, signal);
    });















    // ***********************************************
    // Logging
    // ***********************************************

    server.log('*****************************************************');
    server.log('Ready and awaiting connections on', server.ip + ':' + server.port);
    server.log('*****************************************************');
    server.log('Log Level:', config.logLevel);
    server.log('TCP Connection Retries:', config.tcp.connRetries);
    server.log('TCP Connection Timeout:', util.msReadable(config.tcp.connTimeout));
    server.log('TCP Message Timeout:', util.msReadable(config.tcp.msgTimeout));
    server.log('TCP KeepAlive Every:', util.msReadable(config.tcp.heartbeat));
    server.log('TCP KeepAlive Enabled:', config.tcp.keepAlive);
    server.log('*****************************************************');

    server.on('newConnection', function _newConnection(conn) {

        conn.on('identified', function(id){
            //conn.log('Identified as', id);
        });

        conn.on('unidentified', function(error){
            // conn.log('Not Identifed (',error,')');
        });

        conn.on('signalReceived', function(message) {
            // conn.log(message);
        });

        conn.on('close', function(){

        });

    });



}).call(this);
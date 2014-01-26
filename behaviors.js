(function(undefined){

    module.exports = [

        // ***********************************************
        // Define device behaviors and interactions
        // ***********************************************

        // Panel Spotify Controls
        // -----------------------------------------------

        'any panel btn1 press; playpause music',
        'any panel btn2 press; skipforward music',
        'any panel btn3 press; debug room',
        'any panel btn4 press; status audio in room',


        // Panel Audio Controls in the Room
        // -----------------------------------------------

        'any panel knob press and audio is disabled in room; ' +
            'poweron audio in home ' +
            'and mute audio in home ' +
            'and unmute audio in room ' +
            'and set audio enabled in home ',

        'any panel knob press and audio is enabled in room; ' +
            'togglemute audio in room ',

        'any panel knob turncw and audio is enabled in room; ' +
            'volumeup audio in room ' +
            'and ledcycle audio in room',

        'any panel knob turnccw and audio is enabled in room; ' +
            'volumedown audio in room ' +
            'and ledcycle audio in room',


        // Panel Audio Controls in the Home
        // -----------------------------------------------

        'any panel knob hold and audio is enabled in home; ' +
            'poweroff audio in home ' +
            'and set audio disabled in home ',


        // Audio Player Specific Actions
        // -----------------------------------------------

        // 'any audio power value 1; debug room',

        'any audio btn1 press; togglepower',

        'any audio power on; ledgreen',
        'any audio power off; ledoff',

        'any audio mute on; ledred and ledblink',
        'any audio mute off; ledblue'


















        //'device control1 knob press; test control1'
        //'office panel btn1 press; skipforward music',
        //'kitchen panel btn1 press; randomradio music'
        //'any panel pir motion and motion is enabled in home; play audio in room',


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
        'any panel btn1 hold; poweroff audio in home and set motion disabled in home',

        'any panel btn1 press; skipforward music',
        'any panel btn1 hold; randomradio music',

        'any panel pir hold and motion is disabled in home; set motion enabled in home',
        'any panel pir hold and motion is enabled in home; set motion disabled in home'
        */

        // Future behavior ideas
        //'any panel pir motion and motion is enabled in home; poweron audio in room',
        //'any panel pir motion and light is dark in room; poweron light in room'

    ];


}).call(this);
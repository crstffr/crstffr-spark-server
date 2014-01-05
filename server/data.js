(function(){

    var constant = require('./constant');

    module.exports = {

        users: {
            'crstffr': {
                name: 'Christopher',
                home: {
                    name: '4708',
                    rooms: {

                        'office': {
                            name: 'Office',
                            devices: {
                                '48ff6b065067555039091087': {
                                    name: 'Control Panel 1',
                                    type: constant.DEVICE_TYPE_PANEL
                                }
                                /*
                                ,'48ff6b065067555017201587': {
                                    name: 'Music Player 1',
                                    type: constant.DEVICE_TYPE_MUSIC
                                }*/
                            }
                        },

                        'kitchen': {
                            name: 'Kitchen',
                            devices: {

                            }
                        },

                        'livingroom': {
                            name: 'Living Room',
                            devices: {

                            }
                        }
                    }
                }
            }
        }
    };

}).call(this);





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

                                'control1': {
                                    id: '48ff6b065067555039091087',
                                    type: constant.DEVICE_TYPE.PANEL
                                },

                                'audio1': {
                                    id: '48ff6b065067555017201587',
                                    type: constant.DEVICE_TYPE.AUDIO
                                }

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





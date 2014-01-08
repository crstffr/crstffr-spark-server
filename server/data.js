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
                                    name: 'ctrl1',
                                    type: constant.DEVICE_TYPE_PANEL
                                }

                            }
                        },

                        'kitchen': {
                            name: 'Kitchen',
                            devices: {

                                '48ff6b065067555017201587': {
                                    name: 'ctrl2',
                                    type: constant.DEVICE_TYPE_PANEL
                                }

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





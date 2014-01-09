module.exports = {

    // These values need to match the values
    // defined in each of the core firmwares.

    ACTIONS: {
        DEBUG:      0,
        PRESS:      1,
        PRESSHOLD:  2,
        TURNCW:     3,
        TURNCCW:    4,
        ON:         5,
        OFF:        6,
        UP:         7,
        DOWN:       8,
        MOTION:     9
    },

    COMMANDS: {
        RED:        '1',
        GREEN:      '2',
        BLUE:       '3'
    },

    DEVICE_TYPE_PANEL: 'PANEL',
    DEVICE_TYPE_AUDIO: 'AUDIO',
    DEVICE_TYPE_POWER: 'POWER',

    DEVICE_PANEL: {
        DEBUG: 0,
        BTN1: 1,
        BTN2: 2,
        BTN3: 3,
        BTN4: 4,
        KNOB: 5,
        SENSOR_TEMP:    6,
        SENSOR_LIGHT:   7,
        SENSOR_MOTION:  8
    },

    DEVICE_AUDIO: {
        POWER:  1,
        VOLUME: 2
    }

};




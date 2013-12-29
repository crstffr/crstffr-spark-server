module.exports = {

    // These values need to match the values
    // defined in each of the core firmwares.

    ACTION:         1,
    ACTION_UP:      2,
    ACTION_DOWN:    3,
    ACTION_ON:      4,
    ACTION_OFF:     5,

    DEVICE_TYPE_PANEL: 1,
    DEVICE_TYPE_MUSIC: 2,
    DEVICE_TYPE_POWER: 3,

    DEVICE_PANEL: {
        BTN1: 1,    // Skip forward
        BTN2: 2,    // Play/Pause
        BTN3: 3,    // ???
        BTN4: 4,    // ????
        KNOB: 5,    // Music volume
        SENSOR_TEMP:    6,
        SENSOR_LIGHT:   7,
        SENSOR_MOTION:  8
    },

    DEVICE_MUSIC: {
        POWER:  1,
        VOLUME: 2
    }

};




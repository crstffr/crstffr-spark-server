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
        LEDOFF:     'O',
        LEDRED:     'R',
        LEDGREEN:   'G',
        LEDBLUE:    'B',
        LEDCYAN:    'C',
        LEDMAGENTA: 'N',
        LEDYELLOW:  'Y',

        POWEROFF:   '0',
        POWERON:    '1',
        MUTEOFF:    '2',
        MUTEON:     '3',

        VOLUMEUP:   'U',
        VOLUMEDOWN: 'D',

        TOGGLEMUTE: 'M',
        TOGGLEPOWER:'P'
    },

    DEVICE_TYPE_PANEL: 'PANEL',
    DEVICE_TYPE_AUDIO: 'AUDIO',
    DEVICE_TYPE_POWER: 'POWER',

    DEVICE_PANEL: {
        DEBUG:  0,
        BTN1:   1,
        BTN2:   2,
        BTN3:   3,
        BTN4:   4,
        KNOB:   5,
        TEMP:   6,
        LIGHT:  7,
        PIR:    8
    },

    DEVICE_AUDIO: {
        BTN1:  1
    }

};




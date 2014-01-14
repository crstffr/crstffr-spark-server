module.exports = {

    // These values need to match the values
    // defined in each of the core firmwares.

    DEVICE_TYPE: {
        PANEL: 'PANEL',
        AUDIO: 'AUDIO',
        POWER: 'POWER'
    },

    DEVICE_PANEL: {
        ACTIVITIES: {
            DEBUG:      0,
            PRESS:      1,
            HOLD:       2,
            TURNCW:     3,
            TURNCCW:    4,
            MOTION:     5
        },
        COMPONENTS: {
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
        COMMANDS: {

        }
    },

    DEVICE_AUDIO: {
        ACTIVITIES: {
            DEBUG:  0,
            PRESS:  1,
            HOLD:   2,
            ON:     3,
            OFF:    4,
            UP:     5,
            DOWN:   6
        },
        COMPONENTS: {
            BTN1:  1,
            MUTE:  2,
            POWER: 3
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
        }
    }

};




#include "application.h"
#include "_button.h"

Button::Button(int pin, PinMode mode) {
    pinMode(pin, mode);
    _val = 0;
    _pin = pin;
    _hold = 2000;
    _held = false;
    _down = false;
}

char Button::state() {
    char out = '-';
    _now = millis();
    _val = digitalRead(_pin);
    if (!_down && !_held && _val == HIGH) {
        _down = true;
        _timer = millis();
    } else if (_down && !_held && _val == HIGH) {
        if (_now > _timer + _hold) {
            out = 'H';
            _held = true;
        }
    } else if (_val == LOW) {
        if (_down && !_held) {
            out = 'P';
        }
        _down = false;
        _held = false;
    }
    return out;
}
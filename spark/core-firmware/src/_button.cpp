#include "application.h"
#include "_button.h"

Button::Button(int pin, PinMode mode) {
    pinMode(pin, mode);
    _val = 0;
    _pin = pin;
    _hold = 2000;
    _held = false;
    _down = false;
    if (mode == INPUT_PULLUP) {
        _on = LOW;
        _off = HIGH;
    } else {
        _on = HIGH;
        _off = LOW;
    }
}

char Button::state() {
    char out = '-';
    _now = millis();
    _val = digitalRead(_pin);
    if (!_down && !_held && _val == _on) {
        _down = true;
        _timer = millis();
    } else if (_down && !_held && _val == _on) {
        if (_now > _timer + _hold) {
            out = 'H';
            _held = true;
        }
    } else if (_val == _off) {
        if (_down && !_held) {
            out = 'P';
        }
        _down = false;
        _held = false;
    }
    return out;
}
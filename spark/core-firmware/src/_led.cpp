#include "application.h"
#include "_led.h"

LED::LED(int pinR, int pinG, int pinB) {
    _pinR = pinR;
    _pinG = pinG;
    _pinB = pinB;
    _r = 0;
    _g = 0;
    _b = 0;
    _blink = 0;
    _blinkGap = 350;
    pinMode(_pinR, OUTPUT);
    pinMode(_pinG, OUTPUT);
    pinMode(_pinB, OUTPUT);
}

void LED::tick() {
    _now = millis();
    if (_blinking) {
        calcBlink();
    }
    if (_fading) {
        calcFade();
    }
}

void LED::off() {
    rgb(0,0,0);
}

void LED::blank() {
    analogWrite(_pinR, 0);
    analogWrite(_pinG, 0);
    analogWrite(_pinB, 0);
}

void LED::rgb(int r, int g, int b) {
    analogWrite(_pinR, r);
    analogWrite(_pinG, g);
    analogWrite(_pinB, b);
    _r = r;
    _g = g;
    _b = b;
}

void LED::intensity(int value) {
    int r = int((_r / 100) * value);
    int g = int((_g / 100) * value);
    int b = int((_b / 100) * value);
    rgb(r,g,b);
}

void LED::fade() {
    _fading = true;
    _blinking = false;
}

void LED::calcFade() {

}

void LED::blink() {
    _fading = false;
    _blinking = true;
    _blinkTimer = _now + _blinkGap;
}

void LED::calcBlink() {
    if (_now > _blinkTimer) {
        if (_blink == 0) {
            blank();
        } else {
            rgb(_r,_g,_b);
        }
        _blink = (_blink == 0) ? 1 : 0;
        _blinkTimer = _now + _blinkGap;
    }
}

void LED::color(String name) {

    _fading = false;
    _blinking = false;

    if (name == "white") {
        rgb(255, 255, 255);
    }

    if (name == "red") {
        rgb(255, 0, 0);
    }

    if (name == "green") {
        rgb(0, 255, 0);
    }

    if (name == "blue") {
        rgb(0, 0, 255);
    }

    if (name == "cyan") {
        rgb(0, 255, 255);
    }

    if (name == "magenta") {
        rgb(255, 0, 255);
    }

    if (name == "yellow") {
        rgb(255, 255, 0);
    }

    if (name == "orange") {
        rgb(255, 165, 0);
    }

    intensity(25);

}
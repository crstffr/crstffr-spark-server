#ifndef LED_h
#define LED_h

class LED
{
    public:
        LED(int pinR, int pinG, int pinB);
        void off();
        void tick();
        void rgb(int r, int g, int b);
        void intensity(int value);
        void color(String name);
        void fade();
        void blink();
        void calcFade();
        void calcBlink();

    private:
        int _pinR;
        int _pinG;
        int _pinB;
        int _r;
        int _g;
        int _b;
        int _state;
        int _blink;
        bool _fading;
        bool _blinking;
        unsigned long _now;
        unsigned long _fadeTimer;
        unsigned long _blinkTimer;
        unsigned long _blinkGap;
};

#endif
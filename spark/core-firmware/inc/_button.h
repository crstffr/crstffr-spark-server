#ifndef Button_h
#define Button_h

class Button
{
    public:
        Button(int pin, PinMode mode);
        char state();
    private:
        int _pin;
        int _val;
        bool _down;
        long _hold;
        bool _held;
        unsigned long _now;
        unsigned long _timer;
};

#endif
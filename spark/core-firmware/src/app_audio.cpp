#include "application.h"
#include "_button.h"
#include "_mytcp.h"
#include "_led.h"

// ******************************
// Definitions
// ******************************

int RGB_LED[3] = {A4, A7, A6};
int PIN_POWER = D2;
int PIN_MUTE  = D3;
int PIN_VOLUP = D4;
int PIN_VOLDN = D5;
int PIN_BTN1  = D6;

String STATE_ON  = "1";
String STATE_OFF = "0";

String ACTIVITY_DEBUG = "0";
String ACTIVITY_PRESS = "1";
String ACTIVITY_HOLD  = "2";
String ACTIVITY_ON    = "3";
String ACTIVITY_OFF   = "4";
String ACTIVITY_UP    = "5";
String ACTIVITY_DOWN  = "6";

String COMPONENT_BTN1  = "1";
String COMPONENT_MUTE  = "2";
String COMPONENT_POWER = "3";

char COMMAND_STATUS   = 'S';
char COMMAND_LEDOFF   = 'O';
char COMMAND_LEDWHITE = 'W';
char COMMAND_LEDRED   = 'R';
char COMMAND_LEDGREEN = 'G';
char COMMAND_LEDBLUE  = 'B';
char COMMAND_LEDCYAN  = 'C';
char COMMAND_LEDMAG   = 'N';
char COMMAND_LEDYEL   = 'Y';
char COMMAND_LEDBLINK = 'L';
char COMMAND_LEDFADE  = 'F';
char COMMAND_MUTETOG  = 'M';
char COMMAND_POWERTOG = 'P';
char COMMAND_POWEROFF = '0';
char COMMAND_POWERON  = '1';
char COMMAND_MUTEOFF  = '2';
char COMMAND_MUTEON   = '3';
char COMMAND_VOLUMEUP = 'U';
char COMMAND_VOLUMEDN = 'D';

bool IS_AUDIO_POWERED = false;
bool IS_AUDIO_MUTED = false;

// ******************************
// Function Prototype Definitions
// ******************************

int connect(String ip);
int disconnect(String params);
void checkButton(char state, String component);
void audioMuteOn();
void audioMuteOff();
void audioToggleMute();
void audioPowerOn();
void audioPowerOff();
void audioTogglePower();
void audioVolumeUp();
void audioVolumeDown();
void status();

// ******************************
// Class instantiation
// ******************************

MyTCP mytcp;
LED led(RGB_LED[0], RGB_LED[1], RGB_LED[2]);
Button button1(PIN_BTN1, INPUT_PULLUP);

void setup()
{
    Serial.begin(9600);

    pinMode(PIN_POWER, OUTPUT);
    pinMode(PIN_VOLUP, OUTPUT);
    pinMode(PIN_VOLDN, OUTPUT);
    pinMode(PIN_MUTE,  OUTPUT);
    pinMode(PIN_BTN1, INPUT_PULLUP);

    Spark.function("connect", connect);
    Spark.function("disconnect", disconnect);

    audioMuteOn();
    audioPowerOn();
}

// ******************************
// Main Loop
// ******************************

void loop()
{

    led.tick();
    mytcp.tick();
    checkButton(button1.state(), COMPONENT_BTN1);

    char read = mytcp.read();

    if (read == COMMAND_LEDOFF) {
        led.off();
    } else if (read == COMMAND_LEDWHITE) {
        led.color("white");
    } else if (read == COMMAND_LEDRED) {
        led.color("red");
    } else if (read == COMMAND_LEDGREEN) {
        led.color("green");
    } else if (read == COMMAND_LEDBLUE) {
        led.color("blue");
    } else if (read == COMMAND_LEDCYAN) {
        led.color("cyan");
    } else if (read == COMMAND_LEDMAG) {
        led.color("magenta");
    } else if (read == COMMAND_LEDYEL) {
        led.color("yellow");
    } else if (read == COMMAND_LEDBLINK) {
        led.blink();
    } else if (read == COMMAND_LEDFADE) {
        led.fade();
    } else if (read == COMMAND_MUTEON) {
        audioMuteOn();
    } else if (read == COMMAND_MUTEOFF) {
        audioMuteOff();
    } else if (read == COMMAND_MUTETOG) {
        audioToggleMute();
    } else if (read == COMMAND_POWERON) {
        audioPowerOn();
    } else if (read == COMMAND_POWEROFF) {
        audioPowerOff();
    } else if (read == COMMAND_POWERTOG) {
        audioTogglePower();
    } else if (read == COMMAND_VOLUMEUP) {
        audioVolumeUp();
    } else if (read == COMMAND_VOLUMEDN) {
        audioVolumeDown();
    } else if (read == COMMAND_STATUS) {
        status();
    }

}

// ******************************
// Status
// ******************************

void status() {

    if (IS_AUDIO_POWERED) {
        mytcp.sendValue(COMPONENT_POWER, STATE_ON);
    } else {
        mytcp.sendValue(COMPONENT_POWER, STATE_OFF);
    }

    if (IS_AUDIO_MUTED) {
        mytcp.sendValue(COMPONENT_MUTE, STATE_ON);
    } else {
        mytcp.sendValue(COMPONENT_MUTE, STATE_OFF);
    }

}

// ******************************
// Spark Cloud Functions
// ******************************

int connect(String ip) {
    mytcp.setIP(ip);
    return mytcp.connect();
}

int disconnect(String params) {
    return mytcp.disconnect();
}

// ******************************
// Button Handling
// ******************************

void checkButton(char state, String component) {
    switch (state) {
        case 'P':
            mytcp.sendAction(component, ACTIVITY_PRESS);
            break;
        case 'H':
            mytcp.sendAction(component, ACTIVITY_HOLD);
            break;
    }
}

// ******************************
// Amplifier Commands
// ******************************

void audioMuteOn() {
    IS_AUDIO_MUTED = true;
    digitalWrite(PIN_MUTE, LOW);
    mytcp.sendAction(COMPONENT_MUTE, ACTIVITY_ON);
}

void audioMuteOff() {
    IS_AUDIO_MUTED = false;
    digitalWrite(PIN_MUTE, HIGH);
    mytcp.sendAction(COMPONENT_MUTE, ACTIVITY_OFF);
}

void audioToggleMute() {
    if (IS_AUDIO_MUTED) {
        audioMuteOff();
    } else {
        audioMuteOn();
    }
}

void audioPowerOn() {
    IS_AUDIO_POWERED = true;
    digitalWrite(PIN_POWER, HIGH);
    mytcp.sendAction(COMPONENT_POWER, ACTIVITY_ON);
}

void audioPowerOff() {
    IS_AUDIO_POWERED = false;
    digitalWrite(PIN_POWER, LOW);
    mytcp.sendAction(COMPONENT_POWER, ACTIVITY_OFF);
}

void audioTogglePower() {
    if (IS_AUDIO_POWERED) {
        audioPowerOff();
    } else {
        audioPowerOn();
    }
}

void audioVolumeUp() {
    if (IS_AUDIO_MUTED) {
        audioMuteOff();
    } else {
        for (int i=1; i <= 3; i++){
            digitalWrite(PIN_VOLUP, LOW);
            delay(5);
            digitalWrite(PIN_VOLUP, HIGH);
        }
    }
}

void audioVolumeDown() {
    for (int i=1; i <= 3; i++){
        digitalWrite(PIN_VOLDN, LOW);
        delay(5);
        digitalWrite(PIN_VOLDN, HIGH);
    }
}


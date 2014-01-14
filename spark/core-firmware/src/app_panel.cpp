#include "application.h"
#include "_quadencoder.h"
#include "_button.h"
#include "_mytcp.h"

// ******************************
// Definitions
// ******************************

int PIN_ENC1 = D0;
int PIN_ENC2 = D1;
int PIN_BTN0 = D2;
int PIN_BTN1 = D3;
int PIN_BTN2 = D4;
int PIN_BTN3 = D5;
int PIN_BTN4 = D6;

String ACTIVITY_DEBUG   = "0";
String ACTIVITY_PRESS   = "1";
String ACTIVITY_HOLD    = "2";
String ACTIVITY_TURNCW  = "3";
String ACTIVITY_TURNCCW = "4";
String ACTIVITY_MOTION  = "5";

String COMPONENT_BTN1 = "1";
String COMPONENT_BTN2 = "2";
String COMPONENT_BTN3 = "3";
String COMPONENT_BTN4 = "4";
String COMPONENT_KNOB = "5";
String COMPONENT_SENSOR_TEMP = "6";
String COMPONENT_SENSOR_LIGHT = "7";
String COMPONENT_SENSOR_MOTION = "8";

// ******************************
// Function Prototype Definitions
// ******************************

int connect(String ip);
int disconnect(String params);
void checkKnob(char state, String component);
void checkButton(char state, String component);

// ******************************
// Class instantiation
// ******************************

MyTCP mytcp;
QuadEncoder knob(PIN_ENC1, PIN_ENC2);
Button button0(PIN_BTN0, INPUT_PULLDOWN);
Button button1(PIN_BTN1, INPUT_PULLDOWN);
Button button2(PIN_BTN2, INPUT_PULLDOWN);
Button button3(PIN_BTN3, INPUT_PULLDOWN);
Button button4(PIN_BTN4, INPUT_PULLDOWN);

void setup() {

    Serial.begin(9600);

    pinMode(PIN_ENC1, INPUT_PULLUP);
    pinMode(PIN_ENC2, INPUT_PULLUP);

    Spark.function("connect", connect);
    Spark.function("disconnect", disconnect);
}

// ******************************
// Main Loop
// ******************************

void loop() {

    mytcp.tick();
    mytcp.read();

    checkKnob(knob.state(), COMPONENT_KNOB);
    checkButton(button0.state(), COMPONENT_KNOB);
    checkButton(button1.state(), COMPONENT_BTN1);
    checkButton(button2.state(), COMPONENT_BTN2);
    checkButton(button3.state(), COMPONENT_BTN3);
    checkButton(button4.state(), COMPONENT_BTN4);

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
// Knob and Button Handling
// ******************************

void checkKnob(char state, String component) {
    switch (state) {
        case '>':
            mytcp.send(component, ACTIVITY_TURNCW);
            break;
        case '<':
            mytcp.send(component, ACTIVITY_TURNCCW);
            break;
    }
}

void checkButton(char state, String component) {
    switch (state) {
        case 'P':
            mytcp.send(component, ACTIVITY_PRESS);
            break;
        case 'H':
            mytcp.send(component, ACTIVITY_HOLD);
            break;
    }
}
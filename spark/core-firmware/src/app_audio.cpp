#include "application.h"
#include "_button.h"
#include "_mytcp.h"

// ******************************
// Definitions
// ******************************

int PIN_LEDR  = A5;
int PIN_LEDG  = A4;
int PIN_LEDB  = A1;
int PIN_POWER = D3;
int PIN_VOLUP = D4;
int PIN_VOLDN = D5;
int PIN_MUTE  = D6;
int PIN_BTN1  = D7;

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

char COMMAND_LEDOFF   = 'O';
char COMMAND_LEDRED   = 'R';
char COMMAND_LEDGREEN = 'G';
char COMMAND_LEDBLUE  = 'B';
char COMMAND_LEDCYAN  = 'C';
char COMMAND_LEDMAG   = 'N';
char COMMAND_LEDYEL   = 'Y';
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
// Core Setup
// ******************************

MyTCP mytcp;
Button button1(PIN_BTN1, INPUT_PULLDOWN);

int connect(String ip);
int disconnect(String params);

void setup()
{
    Serial.begin(9600);

    pinMode(PIN_LEDR, OUTPUT);
    pinMode(PIN_LEDG, OUTPUT);
    pinMode(PIN_LEDB, OUTPUT);
    pinMode(PIN_POWER, OUTPUT);
    pinMode(PIN_VOLUP, OUTPUT);
    pinMode(PIN_VOLDN, OUTPUT);
    pinMode(PIN_MUTE,  OUTPUT);
    pinMode(PIN_BTN1, INPUT_PULLDOWN);

    Spark.function("connect", connect);
    Spark.function("disconnect", disconnect);

    audioMuteOff();
    audioPowerOff();
}

// ******************************
// Main Loop
// ******************************

void loop()
{

    mytcp.status();
    char read = mytcp.read();

    if (read == COMMAND_LEDOFF) {
        ledOff();
    } else if (read == COMMAND_LEDRED) {
        ledRed();
    } else if (read == COMMAND_LEDGREEN) {
        ledGreen();
    } else if (read == COMMAND_LEDBLUE) {
        ledBlue();
    } else if (read == COMMAND_LEDCYAN) {
        ledCyan();
    } else if (read == COMMAND_LEDMAG) {
        ledMagenta();
    } else if (read == COMMAND_LEDYEL) {
        ledYellow();
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
    }

    char b1 = button1.state();
    if (b1 == 'P') {
        mytcp.send(COMPONENT_BTN1, ACTIVITY_PRESS);
    } else if (b0 == 'H') {
        mytcp.send(COMPONENT_KNOB, ACTIVITY_HOLD);
    }

}

// ******************************
// Amplifier Commands
// ******************************

void audioMuteOn() {
    IS_AUDIO_MUTED = true;
    digitalWrite(PIN_MUTE, LOW);
    mytcp.send(COMPONENT_MUTE, ACTIVITY_ON);
}

void audioMuteOff() {
    IS_AUDIO_MUTED = false;
    digitalWrite(PIN_MUTE, HIGH);
    mytcp.send(COMPONENT_MUTE, ACTIVITY_OFF);
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
    mytcp.send(COMPONENT_POWER, ACTIVITY_ON);
}

void audioPowerOff() {
    IS_AUDIO_POWERED = false;
    digitalWrite(PIN_POWER, LOW);
    mytcp.send(COMPONENT_POWER, ACTIVITY_OFF);
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
        digitalWrite(PIN_VOLUP, HIGH);
        digitalWrite(PIN_VOLUP, LOW);
    }
}

void audioVolumeDown() {
    digitalWrite(PIN_VOLDN, HIGH);
    digitalWrite(PIN_VOLDN, LOW);
}

// ******************************
// LED Commands
// ******************************

void ledSetColor(int red, int green, int blue) {
    analogWrite(PIN_LEDR, red);
    analogWrite(PIN_LEDG, green);
    analogWrite(PIN_LEDB, blue);
}

void ledOff() {
    ledSetColor(0,0,0);
}

void ledRed() {
    ledSetColor(255, 0, 0);
}

void ledGreen() {
    ledSetColor(0, 255, 0);
}

void ledBlue() {
    ledSetColor(0, 0, 255);
}

void ledCyan() {
    ledSetColor(0, 255, 255);
}

void ledMagenta() {
    ledSetColor(255, 0, 255);
}

void ledYellow() {
    ledSetColor(255, 255, 0);
}


// ******************************
// TCP Connection & Communication
// ******************************

int tcpStatus() {
    if (tcp.connected() && (now > tcpTimer)) {
        tcpDisconnect("");
    }
    if (tcp.connected()) {
        analogWrite(led, HIGH);
        return 1;
    } else {
        analogWrite(led, LOW);
        return -1;
    }
}

void tcpResetTimer() {
    tcpTimer = now + tcpTimeout;
}

int tcpSetIP(String ip) {
    tcpReady = true;
    ipArrayFromString(tcpServer, ip);
    return tcpConnect();
}

int tcpIdentify() {
    return mytcp.send(Spark.deviceID(), DEVICE_TYPE_PANEL);
}

int tcpConnect() {
    if (tcp.connected()) {
        tcp.flush();
        tcp.stop();
    }
    if (tcpReady) {
        if (tcp.connect(tcpServer, tcpPort)) {
            tcpResetTimer();
            return 1;
        } else {
            return -1;
        }
    } else {
        return -1;
    }
}

int tcpDisconnect(String param) {
    tcp.flush();
    tcp.stop();
    return 1;
}

int mytcp.send(String who, String what) {
    if (tcp.connected()) {
        tcpResetTimer();
        tcp.print(STX + who + ETX + what + EOT);
        delay(10);
        return 1;
    } else {
        return -1;
    }
}

void tcpRead() {
    if (tcp.available()) {
        tcpResetTimer();
        char read = tcp.read();

        if (read == ENQ) {
            tcp.print(ACK);
        } else if (read == BEL) {
            tcpIdentify();
        }

        // ******************************
        // Device Specific Commands
        // ******************************



    }
}

// ******************************
// Utility Methods
// ******************************

void ipArrayFromString(byte ipArray[], String ipString) {
  int dot1   = ipString.indexOf('.');
  ipArray[0] = ipString.substring(0, dot1).toInt();
  int dot2   = ipString.indexOf('.', dot1 + 1);
  ipArray[1] = ipString.substring(dot1 + 1, dot2).toInt();
  dot1       = ipString.indexOf('.', dot2 + 1);
  ipArray[2] = ipString.substring(dot2 + 1, dot1).toInt();
  ipArray[3] = ipString.substring(dot1 + 1).toInt();
}









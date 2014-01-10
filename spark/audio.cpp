
// ******************************
// Definitions
// ******************************

String ACTION_PRESS = "1";
String ACTION_HOLD  = "2";
String ACTION_CW    = "3";
String ACTION_CCW   = "4";
String ACTION_ON    = "5";
String ACTION_OFF   = "6";
String ACTION_UP    = "7";
String ACTION_DOWN  = "8";
String ACTION_MOTION= "9";

String DEVICE_TYPE_PANEL = "1";
String DEVICE_TYPE_AUDIO = "2";
String DEVICE_TYPE_POWER = "3";

String INPUT_BTN1 = "1";

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

bool IS_AUDIO_POWER = true;
bool IS_AUDIO_MUTED = false;

// ******************************
// TCP Setup
// ******************************

TCPClient tcp;

char STX = '\x02';
char ETX = '\x03';
char EOT = '\x04';
char ENQ = '\x05';
char ACK = '\x06';
char BEL = '\x07';
int  tcpPort = 5000;
bool tcpReady = false;
long tcpTimeout = 5000;
long tcpSendLimit = 100;
byte tcpServer[4] = {0,0,0,0};
unsigned long now = millis();
unsigned long tcpTimer = millis();
unsigned long tcpSendTimer = millis();

// ******************************
// Core Setup
// ******************************

int led = A0;
int ledR = A5;
int ledG = A4;
int ledB = A1;

int btn1 = D7;

int pinPower = D3;
int pinVolUp = D4;
int pinVolDn = D5;
int pinMute  = D6;

int btn1Val = LOW;
bool btn1Down = false;

void setup()
{
    Serial.begin(9600);
    
    pinMode(led, OUTPUT);
    pinMode(ledR, OUTPUT);
    pinMode(ledG, OUTPUT);
    pinMode(ledB, OUTPUT);
    
    pinMode(pinPower, OUTPUT);
    pinMode(pinVolUp, OUTPUT);
    pinMode(pinVolDn, OUTPUT);
    pinMode(pinMute,  OUTPUT);
    
    pinMode(btn1, INPUT_PULLDOWN);

    Spark.function("connect", tcpSetIP);
    Spark.function("disconnect", tcpDisconnect);
}

// ******************************
// Main Loop
// ******************************

void loop()
{

    now = millis();
    btn1Val = digitalRead(btn1);

    if (!btn1Down && btn1Val == HIGH) {
        btn1Down = true;
        tcpAction(INPUT_BTN1, ACTION_PRESS);
    } else if (btn1Val == LOW) {
        btn1Down = false;
    }
    
    tcpStatus();
    tcpRead();

}

// ******************************
// Amplifier Commands
// ******************************

void audioMuteOn() {
    IS_AUDIO_MUTED = true;
    digitalWrite(pinMute, HIGH);
}

void audioMuteOff() {
    IS_AUDIO_MUTED = false;
    digitalWrite(pinMute, LOW);
}

void audioToggleMute() {
    if (IS_AUDIO_MUTED) {
        audioMuteOff();
    } else {
        audioMuteOn();
    }
}

void audioPowerOn() {
    IS_AUDIO_POWER = true;
    digitalWrite(pinPower, LOW);
}

void audioPowerOff() {
    IS_AUDIO_POWER = false;
    digitalWrite(pinPower, HIGH);
}

void audioTogglePower() {
    if (IS_AUDIO_POWER) {
        audioPowerOff();
    } else {
        audioPowerOn();
    }
}

void audioVolumeUp() {
    if (IS_AUDIO_MUTED) {
        audioMuteOff();
    } else {
        digitalWrite(pinVolUp, HIGH);
        digitalWrite(pinVolUp, LOW);
    }
}

void audioVolumeDown() {
    digitalWrite(pinVolDn, HIGH);
    digitalWrite(pinVolDn, LOW);
}

// ******************************
// LED Commands
// ******************************

void ledSetColor(int red, int green, int blue) {
    analogWrite(ledR, red);
    analogWrite(ledG, green);
    analogWrite(ledB, blue);  
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

void ledMagenta() {
    ledSetColor(255, 0, 255);
}

void ledCyan() {
    ledSetColor(0, 255, 255);
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
    return tcpAction(Spark.deviceID(), DEVICE_TYPE_PANEL);
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

int tcpAction(String who, String what) {
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
            
        if (read == COMMAND_LEDOFF) {
            ledOff();
        } else if (read == COMMAND_LEDRED) {
            ledRed();
        } else if (read == COMMAND_LEDGREEN) {
            ledGreen();
        } else if (read == COMMAND_LEDBLUE) {
            ledBlue();
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









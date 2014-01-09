// ******************************
// Rotary Encoder Class
// ******************************

class QuadEncoder
{
  public:
    QuadEncoder(int pin1, int pin2);
    char tick();
  private:
    bool _moved;
    int _inputPin1;
    int _inputPin2;
    int _val1;
    int _val2;
    int _oldVal1;
    int _oldVal2;
    int _pos;
    int _oldPos;
    int _turn;
    int _turnCount;  
};

QuadEncoder::QuadEncoder(int pin1, int pin2)
{
  pinMode(pin1, INPUT);
  pinMode(pin2, INPUT);
  digitalWrite(pin1, HIGH);
  digitalWrite(pin2, HIGH);
  _inputPin1=pin1;
  _inputPin2=pin2;
  _val1=1;
  _val2=1;
  _oldVal1=1;
  _oldVal2=1;
  _pos=0;
  _oldPos=0;
  _turn=0;
  _turnCount=0;
}

char QuadEncoder::tick()
{  
  _moved = false;
  _val1 = digitalRead(_inputPin1);
  _val2 = digitalRead(_inputPin2);
  if ( _val1 != _oldVal1 || _val2 != _oldVal2) {
    _oldVal1=_val1;
    _oldVal2=_val2;
    if ( _val1 == 1 ) {
      if (_val2 == 1)
        _pos = 0;
      else if (_val2 == 0)
        _pos = 3;
    } else if (_val1 == 0){
      if (_val2 == 1)
        _pos = 1;
      else if (_val2 == 0)
        _pos = 2;
    }
    _turn = _pos-_oldPos;
    _oldPos = _pos;
    if (abs(_turn) != 2) {
      if (_turn == 1 || _turn == -3)
        _turnCount++;
      else if (_turn == -1 || _turn == 3)
        _turnCount--;
    }
    if (_pos==0){
      if (_turnCount>0){
        _turnCount=0;
                _moved = true;
        return '>';
      } else if (_turnCount<0){
                _moved = true;
        _turnCount=0;
        return '<';
      } else {
                _moved = false;
        _turnCount=0;
        return '-';
      }
    } else {
        return '-';
    }
  } else {
      return '-';
  }
}


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
String INPUT_BTN2 = "2";
String INPUT_BTN3 = "3";
String INPUT_BTN4 = "4";
String INPUT_KNOB = "5";
String SENSOR_TEMP = "6";
String SENSOR_LIGHT = "7";
String SENSOR_MOTION = "8";

char COMMAND_RED   = '1';
char COMMAND_GREEN = '2';
char COMMAND_BLUE  = '3';


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

int btn1 = D7; // little switch
int btn2 = D6; // knob button
int btn3 = D2; // PIR motion

int btn1Val = LOW;
int btn2Val = LOW;
int btn3Val = LOW;

bool btn1Down = false;
bool btn2Down = false;
bool btn3Down = false;

int encVal = 0;
int encPin1 = D0;
int encPin2 = D1;

QuadEncoder qe(encPin1, encPin2);

void setup()
{
    Serial.begin(9600);
    
    pinMode(led, OUTPUT);
    pinMode(ledR, OUTPUT);
    pinMode(ledG, OUTPUT);
    pinMode(ledB, OUTPUT);
    
    pinMode(btn1, INPUT_PULLDOWN);
    pinMode(btn2, INPUT_PULLDOWN);
    pinMode(btn3, INPUT_PULLDOWN);
    
    pinMode(encPin1, INPUT_PULLUP);
    pinMode(encPin2, INPUT_PULLUP);

    Spark.function("connect", tcpSetIP);
    Spark.function("disconnect", tcpDisconnect);
}

// ******************************
// Main Loop
// ******************************

void loop()
{

    now = millis();
    encVal  = qe.tick();
    btn1Val = digitalRead(btn1);
    btn2Val = digitalRead(btn2);
    btn3Val = digitalRead(btn3);

    if (encVal == '>') {
        tcpAction(INPUT_KNOB, ACTION_CW);
    } else if (encVal == '<') {
        tcpAction(INPUT_KNOB, ACTION_CCW);
    }
    
    if (!btn1Down && btn1Val == HIGH) {
        btn1Down = true;
        tcpAction(INPUT_BTN1, ACTION_PRESS);
        ledGreen();
    } else if (btn1Val == LOW) {
        btn1Down = false;
    }
    
    if (!btn2Down && btn2Val == HIGH) {
        btn2Down = true;
        tcpAction(INPUT_KNOB, ACTION_PRESS);
    } else if (btn2Val == LOW) {
        btn2Down = false;
    }
    
    if (!btn3Down && btn3Val == HIGH) {
        btn3Down = true;
        tcpAction(SENSOR_MOTION, ACTION_MOTION);
        ledRed();
    } else if (btn3Val == LOW) {
        btn3Down = false;
    }
    
    
    tcpStatus();
    tcpRead();

}


void ledSetColor(int red, int green, int blue) {
    analogWrite(ledR, red);
    analogWrite(ledG, green);
    analogWrite(ledB, blue);  
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
        } else if (read == COMMAND_GREEN) {
            ledGreen();
        } else if (read == COMMAND_BLUE) {
            ledBlue();
        } else if (read == COMMAND_RED) {
            ledRed();
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









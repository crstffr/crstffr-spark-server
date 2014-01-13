// ******************************
// Button Pres & Hold Class
// ******************************

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

int btn0 = D2;
int btn1 = D3;
int btn2 = D4;
int btn3 = D5;
int btn4 = D6;

int btn0Val = LOW;
int btn1Val = LOW;
int btn2Val = LOW;
int btn3Val = LOW;
int btn4Val = LOW;

bool btn0Down = false;
bool btn1Down = false;
bool btn2Down = false;
bool btn3Down = false;
bool btn4Down = false;

int encVal = 0;
int encPin1 = D0;
int encPin2 = D1;

QuadEncoder qe(encPin1, encPin2);
Button button0(btn0, INPUT_PULLDOWN);
Button button1(btn1, INPUT_PULLDOWN);
Button button2(btn2, INPUT_PULLDOWN);
Button button3(btn3, INPUT_PULLDOWN);
Button button4(btn4, INPUT_PULLDOWN);

void setup()
{
    Serial.begin(9600);
    
    pinMode(btn0, INPUT_PULLDOWN);
    pinMode(btn1, INPUT_PULLDOWN);
    pinMode(btn2, INPUT_PULLDOWN);
    pinMode(btn3, INPUT_PULLDOWN);
    pinMode(btn4, INPUT_PULLDOWN);
    
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
    btn0Val = digitalRead(btn0);
    btn1Val = digitalRead(btn1);
    btn2Val = digitalRead(btn2);
    btn3Val = digitalRead(btn3);
    btn4Val = digitalRead(btn4);

    if (encVal == '>') {
        tcpAction(INPUT_KNOB, ACTION_CW);
    } else if (encVal == '<') {
        tcpAction(INPUT_KNOB, ACTION_CCW);
    }
    
    /*
    if (!btn0Down && btn0Val == HIGH) {
        btn0Down = true;
        tcpAction(INPUT_KNOB, ACTION_PRESS);
    } else if (btn0Val == LOW) {
        btn0Down = false;
    }
    
    if (!btn1Down && btn1Val == HIGH) {
        btn1Down = true;
        tcpAction(INPUT_BTN1, ACTION_PRESS);
    } else if (btn1Val == LOW) {
        btn1Down = false;
    }
    
    if (!btn2Down && btn2Val == HIGH) {
        btn2Down = true;
        tcpAction(INPUT_BTN2, ACTION_PRESS);
    } else if (btn2Val == LOW) {
        btn2Down = false;
    }
    
    if (!btn3Down && btn3Val == HIGH) {
        btn3Down = true;
        tcpAction(INPUT_BTN3, ACTION_PRESS);
    } else if (btn3Val == LOW) {
        btn3Down = false;
    }
    
    
    if (!btn4Down && btn4Val == HIGH) {
        btn4Down = true;
        tcpAction(INPUT_BTN4, ACTION_PRESS);
    } else if (btn4Val == LOW) {
        btn4Down = false;
    }
    */
    
    char b0 = button0.state();
    char b1 = button1.state();
    char b2 = button2.state();
    char b3 = button3.state();
    char b4 = button4.state();
    
        
    if (b0 == 'P') {
        tcpAction(INPUT_KNOB, ACTION_PRESS);
    } else if (b0 == 'H') {
        tcpAction(INPUT_KNOB, ACTION_HOLD);
    }
        
    if (b1 == 'P') {
        tcpAction(INPUT_BTN1, ACTION_PRESS);
    } else if (b1 == 'H') {
        tcpAction(INPUT_BTN1, ACTION_HOLD);
    }
        
    if (b2 == 'P') {
        tcpAction(INPUT_BTN2, ACTION_PRESS);
    } else if (b2 == 'H') {
        tcpAction(INPUT_BTN2, ACTION_HOLD);
    }
    
    if (b3 == 'P') {
        tcpAction(INPUT_BTN3, ACTION_PRESS);
    } else if (b3 == 'H') {
        tcpAction(INPUT_BTN3, ACTION_HOLD);
    }
    
    if (b4 == 'P') {
        tcpAction(INPUT_BTN4, ACTION_PRESS);
    } else if (b4 == 'H') {
        tcpAction(INPUT_BTN4, ACTION_HOLD);
    }
    
    
    tcpStatus();
    tcpRead();

}


// ******************************
// TCP Connection & Communication
// ******************************

int tcpStatus() {
    
    if (tcp.connected() && (now > tcpTimer)) {
        tcpDisconnect("");
    }

    if (tcp.connected()) {
        // analogWrite(led, HIGH);
        return 1;
    } else {
        // analogWrite(led, LOW);
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









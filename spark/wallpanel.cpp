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

String DEVICE_TYPE_PANEL = "1";
String DEVICE_TYPE_MUSIC = "2";
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
// Core Setup
// ******************************

int btn1 = D7;
int btn2 = D6;
int btn3 = D2;

int btn1Val = LOW;
int btn2Val = LOW;
int btn3Val = LOW;

bool btn1Down = false;
bool btn2Down = false;
bool btn3Down = false;

int encoderPin1 = D0;
int encoderPin2 = D1;

String encoderStr;
int encoderVal = 0;
QuadEncoder qe(D0,D1);

void setup()
{
    Serial.begin(9600);
    
    pinMode(btn1, INPUT_PULLDOWN);
    pinMode(btn2, INPUT_PULLDOWN);
    pinMode(btn3, INPUT_PULLDOWN);
    
    pinMode(encoderPin1, INPUT_PULLUP); 
    pinMode(encoderPin2, INPUT_PULLUP);

    Spark.function("connect", tcpConnect);
    Spark.function("disconnect", tcpDisconnect);
}

// ******************************
// Main Loop
// ******************************

void loop()
{

    btn1Val = digitalRead(btn1);
    btn2Val = digitalRead(btn2);
    btn3Val = digitalRead(btn3);
    
    
    encoderVal =qe.tick();
    
    if (encoderVal == '>') {
        tcpAction(INPUT_KNOB,"U");
    } else if (encoderVal == '<') {
        tcpAction(INPUT_KNOB,"D");
    }

    if (!btn1Down && btn1Val == HIGH) {
        btn1Down = true;
        tcpAction(INPUT_BTN1, HIGH);
    } else if (btn1Val == LOW) {
        btn1Down = false;
    }
    
    if (!btn2Down && btn2Val == HIGH) {
        btn2Down = true;
        tcpAction(INPUT_BTN1, HIGH);
    } else if (btn2Val == LOW) {
        btn2Down = false;
    }
    
    if (!btn3Down && btn3Val == HIGH) {
        btn3Down = true;
        tcpAction(SENSOR_MOTION, HIGH);
    } else if (btn3Val == LOW) {
        btn3Down = false;
    }
    
    tcpRead();

}

void updateEncoder() {
    encoderStr = String(digitalRead(encoderPin1)) + " " + String(digitalRead(encoderPin2));
}

// ******************************
// TCP Connection & Communication
// ******************************

TCPClient tcp;

char STX = '\x02';
char ETX = '\x03';
char EOT = '\x04';
char ENQ = '\x05';
char ACK = '\x06';
char BEL = '\x07';
int  tcpPort = 5000;

int tcpConnect(String ip) {
    byte address[4];
    ipArrayFromString(address, ip);
    if (tcp.connect(address, tcpPort)) {
        return 1;
    } else {
        return -1;
    }
}

int tcpIdentify() {
    return tcpAction(Spark.deviceID(), "W");
}

int tcpDisconnect(String param) {
    tcp.flush();
    tcp.stop();
    return 1;
}

int tcpAction(String who, String what) {
    if (tcp.connected()) {
        tcp.print(STX + who + ETX + what + EOT);
        return 1;
    } else {
        return -1;
    }
}

void tcpRead() {
    if (tcp.available()) {
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









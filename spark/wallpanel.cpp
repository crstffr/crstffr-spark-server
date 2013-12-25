
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
    // Detect changes
  if ( _val1 != _oldVal1 || _val2 != _oldVal2) {
    _oldVal1=_val1;
    _oldVal2=_val2;

      //for each pair there's a position out of four
    if ( _val1 == 1 ) {// stationary position
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


int btn1 = D6;
int btn1Val = LOW;
bool btn1Down = false;

int encoderPin1 = D0;
int encoderPin2 = D1;

String encoderStr;
int encoderVal = 0;
QuadEncoder qe(D0,D1);


// ******************************
// Core Setup
// ******************************

void setup()
{

    Serial.begin(9600);

    pinMode(btn1, INPUT_PULLDOWN);

    pinMode(encoderPin1, INPUT_PULLUP);
    pinMode(encoderPin2, INPUT_PULLUP);

    Spark.function("type", deviceType);
    Spark.function("connect", tcpConnect);
    Spark.function("disconnect", tcpDisconnect);
}

// ******************************
// Main Loop
// ******************************

void loop()
{

    btn1Val = digitalRead(btn1);

    encoderVal =qe.tick();

    if (encoderVal == '>') {
        tcpSend("ENCODER UP");
    } else if (encoderVal == '<') {
        tcpSend("ENCODER DOWN");
    }

    if (!btn1Down && btn1Val == HIGH) {

        btn1Down = true;

        tcpSend("BTN1PRESSED");


    } else if (btn1Val == LOW) {
        btn1Down = false;
    }

    tcpKeepAlive();

}

void updateEncoder() {
    encoderStr = String(digitalRead(encoderPin1)) + " " + String(digitalRead(encoderPin2));
}

int deviceType(String param) {
    tcpSend("DEVICETYPE:WALLPANEL");
    return 1;
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

int tcpDisconnect(String param) {
    tcp.flush();
    tcp.stop();
    return 1;
}

int tcpSend(String message) {
    if (tcp.connected()) {
        tcp.print(STX + Spark.deviceID() + ETX + message + EOT);
        delay(100);
        return 1;
    } else {
        return -1;
    }
}

void tcpKeepAlive() {
     if (tcp.available()) {
        char read = tcp.read();
        if (read == ENQ) {
            tcp.print(ACK);
        }
    }
}

// ******************************
// Utility Methods
// ******************************

int myIP() {
    return 1;
}

void ipArrayFromString(byte ipArray[], String ipString) {
  int dot1   = ipString.indexOf('.');
  ipArray[0] = ipString.substring(0, dot1).toInt();
  int dot2   = ipString.indexOf('.', dot1 + 1);
  ipArray[1] = ipString.substring(dot1 + 1, dot2).toInt();
  dot1       = ipString.indexOf('.', dot2 + 1);
  ipArray[2] = ipString.substring(dot2 + 1, dot1).toInt();
  ipArray[3] = ipString.substring(dot1 + 1).toInt();
}
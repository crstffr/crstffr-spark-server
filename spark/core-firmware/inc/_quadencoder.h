#ifndef QuadEncoder_h
#define QuadEncoder_h

class QuadEncoder
{
  public:
    QuadEncoder(int pin1, int pin2);
    char state();
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

#endif
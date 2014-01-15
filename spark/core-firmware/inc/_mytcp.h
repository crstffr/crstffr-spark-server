#ifndef MyTCP_h
#define MyTCP_h

class MyTCP
{
    public:
        MyTCP();
        void tick();
        char read();
        bool status();
        int connect();
        int identify();
        int disconnect();
        int setIP(String ip);
        int sendAction(String who, String what);
        int sendValue(String who, String value);

    private:
        TCPClient tcp;
        char STX;
        char ETX;
        char EOT;
        char ENQ;
        char ACK;
        char BEL;
        char DLE;
        int  port;
        bool ready;
        long timeout;
        long sendLimit;
        byte server[4];
        unsigned long now;
        unsigned long timer;
        unsigned long sendTimer;
        int resetTimer();
        void ipFromString(byte ipArray[], String ipString);
};

#endif
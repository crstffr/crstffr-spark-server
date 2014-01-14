#include "application.h"
#include "_mytcp.h"


MyTCP::MyTCP() {

    TCPClient tcp;
    STX = '\x02';
    ETX = '\x03';
    EOT = '\x04';
    ENQ = '\x05';
    ACK = '\x06';
    BEL = '\x07';
    port = 5000;
    ready = false;
    timeout = 5000;
    sendLimit = 100;
    now = millis();
    timer = millis();
    sendTimer = millis();

}

void MyTCP::tick() {
    if (tcp.connected() && (now > timer)) {
        disconnect();
    }
    status();
}

bool MyTCP::status() {
    return tcp.connected();
}

int MyTCP::resetTimer() {
    timer = now + timeout;
    return 1;
}

int MyTCP::setIP(String ip) {
    ipFromString(server, ip);
    ready = true;
    return 1;
}

int MyTCP::connect() {
    if (tcp.connected()) {
        tcp.flush();
        tcp.stop();
    }
    if (ready && tcp.connect(server, port)) {
        resetTimer();
        return 1;
    } else {
        return -1;
    }
}

int MyTCP::identify() {
    return send(Spark.deviceID(), "0");
}

int MyTCP::disconnect() {
    tcp.flush();
    tcp.stop();
    return 1;
}

int MyTCP::send(String who, String what) {
    if (tcp.connected()) {
        resetTimer();
        tcp.print(STX + who + ETX + what + EOT);
        delay(10);
        return 1;
    } else {
        return -1;
    }
}

char MyTCP::read() {
    if (tcp.available()) {
        resetTimer();
        char read = tcp.read();
        if (read == ENQ) {
            tcp.print(ACK);
        } else if (read == BEL) {
            identify();
        } else {
            return read;
        }
    }
    return EOT;
}

void MyTCP::ipFromString(byte ipArray[], String ipString) {
    int dot1   = ipString.indexOf('.');
    ipArray[0] = ipString.substring(0, dot1).toInt();
    int dot2   = ipString.indexOf('.', dot1 + 1);
    ipArray[1] = ipString.substring(dot1 + 1, dot2).toInt();
    dot1       = ipString.indexOf('.', dot2 + 1);
    ipArray[2] = ipString.substring(dot2 + 1, dot1).toInt();
    ipArray[3] = ipString.substring(dot1 + 1).toInt();
}
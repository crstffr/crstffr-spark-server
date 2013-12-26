(function(undefined) {

    var net     = require('net');
    var log     = require('./log.js');
    var utils   = require('./utils.js');
    var config  = require('./config.js');
    var events  = require('events');
    var emitter = new events.EventEmitter;

    // These are control codes that I use for
    // various parts of the communication.

    var STX = '\x02';
    var ETX = '\x03';
    var EOT = '\x04';
    var ENQ = '\x05';
    var ACK = '\x06';
    var SYN = '\x16';

    module.exports = {

        emitter: emitter,

        createServer: function() {
            net.createServer(this.on.create.bind(this)).listen(config.tcp.port);
            emitter.emit('serverStarted', utils.getIP(), config.tcp.port);
        },

        on: {

            create: function(conn) {

                var socket = conn;
                var timeout= 20000;
                var buffer, interval;
                var ip = socket.remoteAddress;
                var port = socket.remotePort;

                // Let subscribers know that a connection
                // has opened at the current IP:Port

                emitter.emit('connectionOpened', ip, port, socket);

                // Set encoding so we get text strings back
                // instead of binary buffer data.

                socket.setEncoding('utf8');

                // Setup the default timeout for the socket
                // so that if a device is disconnected, then
                // it should reconnect after this period.

                socket.setTimeout(timeout, function(){
                    socket.destroy();
                });

                var keepAlive = {
                    start: function() {
                        if (config.tcp.keepAlive) {
                            clearInterval(interval);
                            interval = setInterval(function(){
                                socket.write(ENQ);
                                //var event = 'keepAliveSent:' 
 ip 
 ':' 
 port;
                                emitter.emit('keepAlive', ip, port, 'ENQ', true);
                            }, config.tcp.heartbeat);
                        }
                    },
                    stop: function() {
                        clearInterval(interval);
                    },
                    timeout: function() {

                    }
                };

                emitter.on('keepAlive', function(ip, port, char, send){
                    if (send) {

                    }
                });

                // When the socket connection naturally closes, after
                // about 60 seconds or so, go ahead and trigger the
                // Core to reconnect.  This keeps the TCP session
                // alive much better than actual KeepAlive bits.

                socket.on('close', function(){
                    emitter.emit('connectionClosed', ip, port);
                    clearInterval(keepAlive);
                });

                socket.on('timeout', function(){
                    emitter.emit('connectionTimeout', ip, port);
                });

                socket.on('error', function(error) {
                    emitter.emit('connectionError', ip, port, error);
                });

                // Use buffer to hold incoming data until the entire
                // message is received.  Messages start with STX and
                // end with EOT.  The Device ID is separated from
                // the rest of the message with an ETX.

                socket.on('data', function(data) {

                    var first = data[0];
                    var last  = data[data.length-1];

                    // KeepAlive bit, respond with ACK
                    // and return out to avoid parsing.
                    if (first === ENQ) {
                        emitter.emit('keepAlive', ip, port, 'ENQ', false);
                        socket.write(ACK);
                        emitter.emit('keepAlive', ip, port, 'ACK', true);
                        buffer = '';
                        return;
                    }

                    // KeepAlive bit in the other direction
                    if (first === ACK) {
                        emitter.emit('keepAlive', ip, port, 'ACK', false);
                        buffer = '';
                        return;
                    }

                    // New message, reset buffer.
                    if (first === STX) {
                        buffer = '';
                        keepAlive.stop();
                    }

                    // Append data to our buffer.
                    buffer 
= data;

                    // End of the broadcasted message
                    if (last === EOT) {

                        buffer = buffer.replace(STX ,'').replace(EOT ,'');
                        emitter.emit('bufferComplete', buffer);

                        // @todo: make this a request method
                        this.parse(buffer);

                        keepAlive.start();
                        buffer = '';
                    }

                }.bind(this));



            }

        },


        // Split the incoming data into usable pieces, the
        // WHO (deviceID) and the WHAT of the message.

        parse: function(str) {

            var data;
            var parts = str.split(ETX);

            if (parts.length === 1) {
                data = {
                    what: str,
                    who: 'unidentified',
                    when: utils.now()
                }
            } else {
                data = {
                    who: parts[0],
                    what: parts[1],
                    when: utils.now()
                }
            }

            // Send the information to Firebase
            // This causes a bit of latency if used.
            // logs.push(data).setPriority(data.when);

            emitter.emit('messageReceived', data);

        }

    };

}).call(this);


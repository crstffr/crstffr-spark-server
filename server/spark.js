(function(undefined){

    var Q       = require('q');
    var log     = require('./log');
    var util    = require('./util');
    var sparky  = require('sparky');
    var config  = require('./config');
    var emitter = require('events').EventEmitter;

    function Spark(id) {

        this.id = id;
        this.ip = '';
        this.port = 0;
        this.connectDefer = {};

        this.core = new sparky({
            token: config.spark.token,
            deviceId: this.id,
            debug: false
        });

    }

    util.inherits(Spark, emitter, {

        connect: function(ip) {
            this.connectDefer = Q.defer();
            log.server('Asking core to connect');
            this.core.run('connect', ip);
            return this.connectDefer;
        },

        handshake: function() {

        }

    });

/*

    var sparks  = {};
    var busy    = false;
    var server  = utils.getIP();
    var cores   = config.spark.cores;
    var timer   = 2000; // timeout time
    var retry   = 5000; // retry interval

    // When a Spark Core is connecting to the server, we don't
    // know what IP it's going to have until after it connects,
    // which is an asynchronous event. So, when a Core is in the
    // process of connecting, register a one-time event on TCP
    // connectionOpen so that the next connection can be
    // associated with this device and we can capture the IP
    // and port of the newly connected Core.

    emitter.on('connecting', function(id) {

        var event = 'connectionOpened';

        // This timeout is in place to make sure that a missing
        // core doesn't halt the whole connection process for
        // the rest of the devices.

        var timeout = setTimeout(function(){
            tcp.emitter.removeListener(event, onConnection);
            Spark.timedOut(id);
        }.bind(this), timer);

        // Callback function for a successful connection
        // that is bound to the connectionOpened event.

        var onConnection = function(ip, port, socket) {
            Spark.connected(id, ip, port, socket);
            clearTimeout(timeout);
        };

        tcp.emitter.once(event, onConnection);

    });

    emitter.on('getType', function(id){
        tcp.emitter.once('messageReceived', function(data){
            if (data.who == id) {
                Spark.setType(id, data.what);
            }
        });
    });

    var Spark = {

        emitter: emitter,

        id: function(id) {
            return id.substr(0,5);
        },

        startWatch: function() {
            setInterval(this.checkAll.bind(this), retry);
        },

        init: function(id) {
            if (sparks[id] === undefined) {
                sparks[id] = new sparky({
                    token: config.spark.token,
                    deviceId: id,
                    debug: false
                });
            }
        },

        checkAll: function() {
            for(var i = 0; i < cores.length; i++) {
                log.core(this.id(cores[i]), 'Status', this.check(cores[i]));
            }
        },

        check: function(id) {
            if (!this.isConnected(id)){
                this.destroy(id);
                return false;
            }
            return true;
        },

        connectAll: function() {
            // @todo: throttle so only one device connects at a go
            for(var i = 0; i < cores.length; i++) {
                this.connect(cores[i]);
            }
        },

        connect: function(id) {
            busy = true;
            this.init(id);
            if (!this.isConnected(id)) {
                emitter.emit('connecting', id);
                sparks[id].run('connect', server);
            }
        },

        isConnected: function(id) {
            if (sparks[id].socket !== undefined) {
                return !sparks[id].socket.destroyed;
            } else {
                return false;
            }
        },

        connected: function(id, ip, port, socket) {
            busy = false;
            this.stopRetry(id);
            sparks[id].ip = ip;
            sparks[id].socket = socket;
            emitter.emit('connected', id, ip, port);
            this.getType(id);
        },

        getType: function(id) {
            this.init(id);
            if (sparks[id].type === undefined) {
                sparks[id].run('type', server);
                emitter.emit('getType', id);
            }
        },

        setType: function(id, type) {
            sparks[id].type = type;
            emitter.emit('setType', id, type);
        },

        reconnect: function(ip) {
            var id = this.getIdByIp(ip);
            if (id) { this.connect(id); }
        },

        timedOut: function(id) {
            busy = false;
            this.startRetry(id);
            emitter.emit('timedOut', id);
        },

        startRetry: function(id) {
            if (sparks[id].retry === undefined) {
                emitter.emit('startRetry', id);
                sparks[id].retry = setInterval(function(){
                    this.connect(id);
                }.bind(this), retry);
            }
        },

        stopRetry: function(id) {
            if (sparks[id].retry !== undefined) {
                emitter.emit('stopRetry', id);
                clearInterval(sparks[id].retry);
                sparks[id].retry = undefined;
            }
        },

        destroy: function(id) {
            if (sparks[id].socket !== undefined) {
                sparks[id].socket.destroy();
            }
            sparks[id] = undefined;
            emitter.emit('destroyed', id);
        },

        getIdByIp: function(ip) {
            var spark, id;
            for(id in sparks) {
                if(sparks.hasOwnProperty(id)) {
                    spark = sparks[id];
                    if (spark.ip === undefined) {
                        continue;
                    } else if (spark.ip === ip) {
                        return id;
                    }
                }
            }
            return false;
        }

    }

*/

    module.exports = Spark;

}).call(this);
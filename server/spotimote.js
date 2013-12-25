
var request = require('request');

function Spotimote(config) {

    config = config || {};
    this.config = config;
    this.noop = function(){};

    this.timeout = 60;
    this.heartbeat = 30000;
    this.interval = {};
    this.server = {
        ip:     config.server,
        port:   config.port || 5116,
        path:   config.path || '/clear',
        conn:   0,  // last time it was connected
        hash:   ''  // unique connection reference
    };

    // Hexadecimal control characters, used in the
    // communication messages to the Spotimote server.

    this.ctrl = {
        "BS":  "\x08",
        "RS":  "\x1E",
        "EM":  "\x19",
        "SI":  "\x0F",
        "DLE": "\x10",
        "NUL": "\x00",
        "SUB": "\x1A",
        "BEL": "\x07",
        "EOT": "\x04",
        "ETX": "\x03",
        "STX": "\x02",
        "SOH": "\x01",
        "DC2": "\x12",
        "x80": "\x80"
    }

    this._connect();
    this._keepAlive();

}

Spotimote.prototype = {

    _log: function () {
        if (this.config.debug) {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift("Spotimote: ");
            console.log.apply(console, args);
        }
    },

    _codes: function() {
        var out = "";
        var key, code;
        for (var i=0; i<arguments.length; i++) {
            out += this.ctrl[arguments[i]];
        }
        return out;
    },

    _now: function() {
        return new Date().getTime() / 1000;
    },

    _bind: function(callback) {
        callback = callback || this.noop;
        return callback.bind(this);
    },

    _stripHex: function(str) {
        return str.replace(/[\x00-\x1f]/g, '');
    },

    _checkHash: function(hash) {
        return (hash.length > 10 && hash[0] === '$');
    },

    _keepAlive: function() {
        this.interval = setInterval(this.wait.bind(this), this.heartbeat);
    },

    _timedOut: function() {
        return (this.server.conn + this.timeout < this._now());
    },

    _send: function(str, callback) {
        callback = this._bind(callback);
        var url = 'http://' + this.server.ip + ':' + this.server.port + this.server.path;
        var req = request.post(url, {body: str}, function(err, res, body){
            res.setEncoding('utf8');
            this.server.conn = this._now();
            // @TODO: Error handling for when the server is unavailable
            callback(body);
        }.bind(this)).end();
    },

    _connect: function(callback) {

        callback = this._bind(callback);

        if (this._timedOut()) {

            this._log("Connecting...");

            var prefix = this._codes('BS', 'x80', 'ETX', 'DLE', 'NUL', 'SUB', 'BEL');
            var suffix = this._codes('STX', 'BS', 'SOH');
            var string = prefix + 'connect*' + suffix;

            this._send(string, function(body){

                // Check if the connection responded with a hash
                // that we can parse out and save for later use.

                if (body.indexOf('$') > -1) {

                    // The connection reference hash starts directly after a
                    // cariage return line feed, with some hex garbage after.
                    // Split by newline and check for a value.  If it's not
                    // there then fail out.

                    var parts = body.split("\n");
                    var hash = this._stripHex(parts[1]);

                    if (this._checkHash(hash)) {
                        this._log("Success: ", hash);
                        this.server.conn = this._now();
                        this.server.hash = hash;
                        callback();
                    } else {
                        this._log("Invalid hash: ", hash);
                    }

                } else {

                    this._log("No hash: ", body);

                }

            });

        } else {
            callback();
        }
    },

    playPause: function(){

        this._connect(function(){

            this._log("PlayPause...");
            var prefix = this._codes('BS', 'x80', 'SOH', 'DLE', 'SOH', 'SUB', 'SI');
            var string = prefix + 'actionPlayPause"' + this.server.hash;
            this._send(string, function(body){
                this._log("PlayPause complete");
            });

        });
    },

    wait: function(callback) {

        callback = this._bind(callback);

        this._connect(function(){

            this._log("KeepAlive");
            var prefix = this._codes('BS', 'x80', 'ETX', 'DLE', 'NUL', 'SUB', 'EOT');
            var suffix = this._codes('STX', 'BS', 'RS');
            var string = prefix + 'wait"' + this.server.hash + '*' + suffix;
            this._send(string, function(body){
                callback(body);
            });

        });

    }

};

module.exports = Spotimote;


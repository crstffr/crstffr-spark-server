(function(undefined){

    var log      = require('./log');
    var util     = require('./util');
    var sparky   = require('sparky');
    var config   = require('./config');
    var constant = require('./constant');

    var panel   = require('./device/panel');
    var music   = require('./device/music');
    var power   = require('./device/power');
    var emitter = require('events').EventEmitter;

    var Device = function(id) {

        emitter.call(this);

        this.id     = id;
        this.is     = false;
        this.ip     = false;
        this.port   = false;
        this.conn   = false;
        this.sid    = id.substr(id.length - 5);
        this.core = new sparky({
            token: config.spark.token,
            deviceId: this.id,
            debug: false
        });

    }

    util.inherits(Device, emitter, {

        toString: function() {
            return this.sid;
        },

        connect: function(){
            this.core.run('connect', util.getIP());
            return this;
        },

        disconnect: function() {
            if (this.conn) {
                this.conn.removeAllListeners();
                this.conn = false;
            }
            return this;
        },

        setIP: function(ip, port) {
            this.ip = ip;
            this.port = port;
            return this;
        },

        setType: function(type) {
            this.type = type;

            // Depending on the device type, inherit
            // some device specific methods

            switch (parseInt(this.type)) {
                case constant.DEVICE_TYPE_PANEL:
                    panel.call(this);
                    util.inherits(this, panel);
                    break;
                case constant.DEVICE_TYPE_MUSIC:
                    music.call(this);
                    util.inherits(this, music);
                    break;
                case constant.DEVICE_TYPE_POWER:
                    power.call(this);
                    util.inherits(this, power);
                    break;
            }

            return this;

        }

    });

    module.exports = Device;

}).call(this);
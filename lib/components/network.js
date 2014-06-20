(function(undefined){

    var util = require('util');
    var Component = require('../component');
    var log = require('../utils/log');

    function NetworkComponent() {

        Component.apply(this, arguments);

        this.connect();

        this.when('connect', function(msg){
            switch (msg) {
                case 'SYN':
                    this.connect();
                    break;
                case 'ACK':
                    this.connected();
                    break;
            }
        }, this);

        this.when('disconnect', function(){
            this.disconnected();
        }, this);

    }

    util.inherits(NetworkComponent, Component);

    NetworkComponent.prototype.connect = function() {
        this.sendCommand('connect', 'SYNACK');
    }

    NetworkComponent.prototype.disconnect = function() {
        this.sendCommand('disconnect', '1');
    }

    NetworkComponent.prototype.connected = function() {
        if (this.status.connected !== 'true') {
            this.updateDatabase('connected', 'true');
        }
    }

    NetworkComponent.prototype.disconnected = function() {
        if (this.status.connected !== 'false') {
            this.updateDatabase('connected', 'false');
        }
    }

    NetworkComponent.prototype.onConnect = function(fn) {
        this.when('connect', 'ACK', fn);
    }

    NetworkComponent.prototype.onDisconnect = function(fn) {
        this.when('disconnect', fn);
    }


    module.exports = NetworkComponent;

}).call(this);
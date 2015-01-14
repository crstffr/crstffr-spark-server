(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function NetworkComponent() {

        Component.apply(this, arguments);

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

        this.connect();

    }

    util.inherits(NetworkComponent, Component);

    /**
     * What to do when the device or server is reset
     */
    NetworkComponent.prototype.reset = function() {
        this.disconnected();
    };

    /**
     * Tell the device to connect
     */
    NetworkComponent.prototype.connect = function() {
        this.sendCommand('connect', 'SYNACK');
    };

    /**
     * Update database to reflect the connected state
     */
    NetworkComponent.prototype.connected = function() {
        if (this.status.connected !== 'true') {
            this.updateDatabase('connected', 'true');
        }
    };

    /**
     * Bind a handler for a connect ACK signal
     * @param fn
     */
    NetworkComponent.prototype.onConnect = function(fn) {
        this.when('connect', 'ACK', fn);
    };

    /**
     * Tell the device to disconnect
     */
    NetworkComponent.prototype.disconnect = function() {
        this.sendCommand('disconnect', '1');
    };

    /**
     * Update database to reflect disconnected state
     */
    NetworkComponent.prototype.disconnected = function() {
        if (this.status.connected !== 'false') {
            this.updateDatabase('connected', 'false');
        }
    };

    /**
     * Bind a handler for a disconnect signal
     * @param fn
     */
    NetworkComponent.prototype.onDisconnect = function(fn) {
        this.when('disconnect', fn);
    };


    module.exports = NetworkComponent;

}).call(this);
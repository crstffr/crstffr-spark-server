(function(undefined){

    var util = require('util');
    var Component = require('../component');

    function NetworkComponent() {

        Component.apply(this, arguments);

        this.setAttrs(['connected']);

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
        if (this.attrs.connected.value !== 'true') {
            this.attrs.connected.set('true');
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
        if (this.attrs.connected.value !== 'false') {
            this.attrs.connected.set('false');
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
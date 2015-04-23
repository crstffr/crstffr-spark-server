(function(undefined) {

    var util = require('util');
    var Device = require('../device');
    var config = require('../../config');
    var io = require("../services/webserver").io;

    function TesterDevice(id) {

        Device.call(this, id);

        this.type = 'tester';

        this.loadComponents({
            'dac1': {
                type: 'dac'
            },
            'dac2': {
                type: 'dac'
            },
            'adc1': {
                type: 'adc'
            },
            'adc2': {
                type: 'adc'
            },
            'L-Series': {
                type: 'adc'
            },
            'L-Shunt': {
                type: 'adc'
            },
            'vol': {
                type: 'volume'
            },
            'test': {
                type: 'generic'
            }
        });

        this.components['adc1'].onRead(function(val) {
            // this.log('ADC value read', val);
        }.bind(this));

        io.on('connection', function(socket){

            socket.on('calibrate1', function(data){
                this.sendCommand("ldr1/run", "calibrate");
            }.bind(this));

            socket.on('calibrate2', function(data){
                this.sendCommand("ldr2/run", "calibrate");
            }.bind(this));

            socket.on('resetall', function(data){
                this.sendCommand("ldr1/reset", "reset");
            }.bind(this));

        }.bind(this));

    }

    util.inherits(TesterDevice, Device);

     /**
     * When this class is instantiated, send any configuration data
     * from our server back to the device (if there is any)
     */
    TesterDevice.prototype.configure = function() {
        Device.prototype.configure.call(this);
        var cfg = config.devices.tester;
        this.debug(cfg.debug);
    };

    module.exports = TesterDevice;

}).call(this);
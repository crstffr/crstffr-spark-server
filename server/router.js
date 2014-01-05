(function(undefined){

    var log     = require('./log');
    var util    = require('./util');
    var config  = require('./config');
    var constant = require('./constant');
    var behavior = require('./behavior');

    var emitter = require('events').EventEmitter;

    var Router = function(user) {

        emitter.call(this);

        this.behaviors = [];
        this.devices = user.deviceManager();

        // Define some behaviors
        [
            'any panel btn1 press; motion enable in home',
            'any panel btn1 press; music powertoggle in sameroom',
            'any panel btn1 presshold; motion disable in home',
            'any panel btn1 presshold; music poweroff in home',
            'any panel btn2 press; music skipforward in home',
            'any panel knob turncw; music volumeup in sameroom',
            'any panel knob turnccw; music volumedown in sameroom',
            'any panel pir motion and motion is enabled in home; music poweron in sameroom'

        ].forEach(this.registerBehavior.bind(this));

    }

    util.inherits(Router, emitter, {

        registerBehavior: function(string) {

            var newBehavior = new behavior(string);
            this.behaviors.push(newBehavior);

        },

        parseSignal: function(device, signal) {

            //device.log('said', signal);

            var type = device.type;
            var room = device.room;
            var component = device.component(signal.who);
            var action = device.action(signal.what);

            device.log(component,action);



        },







        route: function(device, signal) {
            device.log('said', signal);
            device.dispatch(signal);
        }

    });

    module.exports = Router;

}).call(this);
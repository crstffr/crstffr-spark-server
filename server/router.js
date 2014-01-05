(function(undefined){

    var log     = require('./log');
    var util    = require('./util');
    var config  = require('./config');
    var constant = require('./constant');
    var behavior = require('./behavior');

    var emitter = require('events').EventEmitter;

    var Router = function(user) {

        emitter.call(this);

        this.user = user;
        this.behaviors = [];
        this.devices = user.deviceManager();

        // Define some behaviors
        [
            'any panel btn2 press; enable motion in home and music powertoggle in sameroom',
            'any panel btn2 presshold; disable motion in home and music poweroff in home',
            'any panel btn1 press; music skipforward in home',
            'any panel knob turncw; music volumeup in sameroom',
            'any panel knob turnccw; music volumedown in sameroom',
            'any panel pir motion and motion is enabled in home; music poweron in sameroom',

            'any panel btn1 press and motion is disabled in kitchen; set motion enabled in sameroom',
            'any panel btn1 press and motion is disabled in office; set motion enabled in sameroom',
            'any panel btn1 press and motion is disabled in sameroom; set motion enabled in sameroom',
            'any panel btn1 press and motion is disabled in home; set motion enabled in home',
            'any panel btn1 press and motion is enabled in home; set motion disabled in home'

        ].forEach(this.registerBehavior.bind(this));

    }

    util.inherits(Router, emitter, {

        registerBehavior: function(string) {

            var newBehavior = new behavior(string, this.user);
            this.behaviors.push(newBehavior);

        },

        parseSignal: function(device, signal) {

            var activity = {
                room: device.room,
                device: device.type,
                component: device.getComponent(signal.who),
                action: device.getAction(signal.what)
            };

            activity.string = [activity.room,
                               activity.device,
                               activity.component,
                               activity.action].join(' ');

            if (!activity.component || !activity.action) {
                return false;
            }

            this.getRelevantBehaviors(activity).forEach(function(behavior){

                log.server('');
                log.server('Behavior:', behavior.condition);
                log.server('Triggers:', behavior.action);

            }.bind(this));

        },

        getRelevantBehaviors: function(activity) {
            var i, output = [];
            var thisBehavior;
            for (i = 0; i < this.behaviors.length; i++) {
                thisBehavior = this.behaviors[i];
                if (thisBehavior.test(activity)) {
                    output.push(thisBehavior);
                }
            }
            return output;
        }

    });

    module.exports = Router;

}).call(this);
(function(undefined){

    var log      = require('./log');
    var util     = require('./util');
    var config   = require('./config');
    var constant = require('./constant');
    var behavior = require('./behavior');
    var emitter  = require('events').EventEmitter;

    var Router = function(user) {

        emitter.call(this);

        this.user = user;
        this.devices = user.deviceManager();
        this.behaviors = [];

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
                behavior.execute(activity);

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
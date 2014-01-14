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
                type: device.type,
                device: device.name,
                action: device.getActivity(signal.what),
                component: device.getComponent(signal.who)
            };

            activity.string = [activity.room,
                               activity.type,
                               activity.device,
                               activity.component,
                               activity.action].join(' ');

            if (!activity.component || !activity.action) {
                return false;
            }

            this.getRelevantBehaviors(activity).forEach(function(behavior) {

                log.server('');
                log.server('Activity:', activity.string);
                log.server('Behavior:', behavior.condition);
                //log.server('Executes:', behavior.action);

                this.user.execute(behavior.actions, activity);

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
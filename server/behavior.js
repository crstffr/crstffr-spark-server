(function(undefined){

    var log     = require('./log');
    var util    = require('./util');
    var config  = require('./config');
    var constant = require('./constant');

    var emitter = require('events').EventEmitter;

    var Behavior = function(string) {

        // Some Examples:
        // ['any panel btn1 press; music enable in home'],
        // ['any panel pir motion and music is enabled in home; music poweron in sameroom']

        emitter.call(this);
        this.string = string;
        this.parse(string);

    }

    util.inherits(Behavior, emitter, {

        test: function() {



        },

        parse: function(behavior) {

            var strings = behavior.split(';');
            var condition = strings[0].trim();
            var action = strings[1].trim();

            this.conditions = condition.split('and').map(this.parseCondition.bind(this));
            this.actions = action.split('and').map(this.parseAction.bind(this));

        },

        parseCondition: function(string) {
            var parts = string.trim().split(' ');
            if (parts[1] == 'is') {
                return {
                    is: 'comparison',
                    who: parts[0],
                    what: parts[2],
                    where: parts[4]
                };
            } else {
                return {
                    is: 'device',
                    room: parts[0],
                    type:  parts[1],
                    component: parts[2],
                    action: parts[3]
                };
            }
        },

        parseAction: function(string) {
            var parts = string.trim().split(' ');
            return {
                which: parts[0],
                action:  parts[1],
                where: parts[3]
            };
        }


    });

    module.exports = Behavior;

}).call(this);
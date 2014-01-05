(function(undefined){

    var log     = require('./log');
    var util    = require('./util');
    var config  = require('./config');
    var constant = require('./constant');

    var emitter = require('events').EventEmitter;

    var Behavior = function(string, user) {

        string = string.toUpperCase();
        // Some Examples:
        // ['any panel btn1 press; music enable in home'],
        // ['any panel pir motion and music is enabled in home; music poweron in sameroom']

        emitter.call(this);
        this.user = user;
        this.string = string;
        this.condition = '';
        this.conditions = [];
        this.action = '';
        this.actions = [];

        this.parse(string);

    }

    util.inherits(Behavior, emitter, {

        log: function() {
            log.behavior.apply(log, arguments);
        },

        // ***********************************************
        // Testing activity versus this behavior
        // ***********************************************

        test: function(activity) {

            this.log('----');
            this.log('TEST:', activity.string);
            this.log('AGAINST:', this.condition);

            return this.conditions.every(function(condition){

                var result;

                this.log('CONDITION:', condition.string.trim());

                if (condition.is == 'activity') {

                    result = this.testActivityCondition(condition, activity);

                } else if (condition.is == 'comparison') {

                    result = this.testComparisionCondition(condition, activity);

                }

                this.log('RESULT:', result.toString().toLocaleUpperCase());
                return result;

            }.bind(this));
        },

        testActivityCondition: function(condition, activity) {
            
            var check = true;
            var c = condition;
            var a = activity;

            if (c.room != 'ANY' && c.room != a.room) {

                this.log('  FALSE: Room mismatch', a.room, '!=', c.room);
                check = false;

            } else if (c.device != a.device) {

                this.log('  FALSE: Device mismatch', a.device, '!=', c.device);
                check = false;

            } else  if (c.component != a.component) {

                this.log('  FALSE: Component mismatch', a.component, '!=', c.component);
                check = false;

            } else if (c.action != a.action) {
                this.log('  FALSE: Action mismatch', a.action, '!=', c.action);
                check = false;
            }

            if (check) { this.log('  TRUE'); }
            return check;

        },

        testComparisionCondition: function(condition, activity) {

            var room = '';
            var check = true;
            var c = condition;
            var a = activity;

            if (c.where == 'HOME') {

                check = this.user.home.check(c.who, c.what)

            } else if (c.where == 'SAMEROOM') {

                room = this.user.home.room(a.room);
                check = room.check(c.who, c.what);

            } else if (c.where){

                room = this.user.home.room(c.where);
                check = room.check(c.who, c.what);

            }

            this.log('  ',check.toString().toUpperCase());
            return check;

        },

        // ***********************************************
        // Parsing the plain language behavior strings
        // ***********************************************

        parse: function(behavior) {

            var strings = behavior.split(';');
            this.condition = strings[0].trim();
            this.action = strings[1].trim();

            this.conditions = this.condition.split('AND').map(this.parseCondition.bind(this));
            this.actions = this.action.split('AND').map(this.parseAction.bind(this));

        },

        parseCondition: function(string) {
            var parts = string.trim().split(' ');
            if (parts[1] == 'IS') {
                return {
                    is: 'comparison',
                    who: parts[0],
                    what: parts[2],
                    where: parts[4],
                    string: string
                };
            } else {
                return {
                    is: 'activity',
                    room: parts[0],
                    device:  parts[1],
                    component: parts[2],
                    action: parts[3],
                    string: string
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
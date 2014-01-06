(function(undefined) {

    var log = require('./log');
    var util = require('./util');
    var config = require('./config');
    var constant = require('./constant');
    var music = require('./system/music');
    var emitter = require('events').EventEmitter;

    var Behavior = function(string, user) {

        string = string.toUpperCase();

        emitter.call(this);
        this.user = user;
        this.string = string;
        this.condition = '';
        this.conditions = [];
        this.action = '';
        this.actions = [];

        this.parse(string);

    };

    util.inherits(Behavior, emitter, {

        log: function() {
            log.behavior.apply(log, arguments);
        },

        // ***********************************************
        // Parsing the plain language behavior strings
        // ***********************************************

        /**
         *
         * @param string
         */
        parse: function(string) {
            var strings = string.split(';');
            this.action = strings[1].trim();
            this.condition = strings[0].trim();
            var actions = this.action.split('AND');
            var conditions = this.condition.split('AND');
            this.actions = actions.map(this.parseAction.bind(this));
            this.conditions = conditions.map(this.parseCondition.bind(this));
        },

        /**
         *
         * @param string
         * @return {Object}
         */
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
                    device: parts[1],
                    component: parts[2],
                    action: parts[3],
                    string: string
                };
            }
        },

        /**
         *
         * @param string
         * @return {Object}
         */
        parseAction: function(string) {
            var parts = string.trim().split(' ');
            if (parts[0] == 'SET') {
                return {
                    is: 'variable',
                    key: parts[1],
                    val: parts[2],
                    where: parts[4],
                    string: string
                };
            } else if (parts[1] == 'MUSIC') {
                return {
                    is: 'music',
                    command: parts[0]
                };
            } else {
                return {
                    is: 'physical',
                    command: parts[0],
                    which: parts[1],
                    where: parts[3],
                    string: string
                };
            }
        },

        // ***********************************************
        // Test an activity against this behavior
        // ***********************************************

        /**
         *
         * @param activity
         * @return {Boolean}
         */
        test: function(activity) {
            this.log('----');
            this.log('TEST:', activity.string);
            this.log('AGAINST:', this.condition);
            return this.conditions.every(function(condition) {
                var result;
                this.log('CONDITION:', condition.string.trim());
                switch (condition.is) {
                    case 'activity':
                        result = this.testActivityCondition(condition, activity);
                        break;
                    case 'comparison':
                        result = this.testComparisionCondition(condition, activity);
                        break;
                }
                this.log('RESULT:', result.toString().toLocaleUpperCase());
                return result;
            }.bind(this));
        },

        /**
         *
         * @param condition
         * @param activity
         * @return {Boolean}
         */
        testActivityCondition: function(condition, activity) {
            var check = true;
            var a = activity;
            var c = condition;
            if (c.room != 'ANY' && c.room != a.room) {
                this.log('  FALSE: Room mismatch', a.room, '!=', c.room);
                check = false;
            } else if (c.device != a.device) {
                this.log('  FALSE: Device mismatch', a.device, '!=', c.device);
                check = false;
            } else if (c.component != a.component) {
                this.log('  FALSE: Component mismatch', a.component, '!=', c.component);
                check = false;
            } else if (c.action != a.action) {
                this.log('  FALSE: Action mismatch', a.action, '!=', c.action);
                check = false;
            }
            if (check) {
                this.log('  TRUE');
            }
            return check;
        },

        /**
         *
         * @param condition
         * @param activity
         * @return {Boolean}
         */
        testComparisionCondition: function(condition, activity) {
            var room = '';
            var check = true;
            var a = activity;
            var c = condition;
            switch (c.where) {
                case 'HOME':
                    check = this.user.home.check(c.who, c.what)
                    break;
                case 'SAMEROOM':
                    room = this.user.home.room(a.room);
                    check = room.check(c.who, c.what);
                    break;
                default:
                    room = this.user.home.room(c.where);
                    check = room.check(c.who, c.what);
                    break;
            }
            this.log('  ', check.toString().toUpperCase());
            return check;
        },

        // ***********************************************
        // Execute behavior actions, with activity context
        // ***********************************************

        execute: function(activity) {

            this.actions.forEach(function(action) {

                var where;

                if (action.is == 'music') {
                    music.execute(action.command);
                    return;
                }

                switch (action.where) {
                    case 'HOME':
                        where = this.user.home;
                        break;
                    case 'SAMEROOM':
                        where = this.user.home.room(activity.room);
                        break;
                    default:
                        where = this.user.home.room(action.where);
                        break;
                }

                if (where) {
                    switch(action.is) {
                        case 'physical':
                            where.execute(action.which, action.command);
                            break;
                        case 'variable':
                            where.set(action.key, action.val);
                            break;
                    }
                }

            }.bind(this));

        }



    });

    module.exports = Behavior;

}).call(this);
(function(undefined){

    var util = require('util');
    var moment = require('moment');
    var Component = require('../component');

    function PirComponent() {

        Component.apply(this, arguments);

        this.onMotion(function(){
            this.node.update({
                'motion': moment.utc().format()
            });
        }.bind(this));

    }

    util.inherits(PirComponent, Component);

    PirComponent.prototype.onMotion = function(fn){
        this.when('', 'motion', fn);
    };

    module.exports = PirComponent;

}).call(this);
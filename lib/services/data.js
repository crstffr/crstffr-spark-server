(function(undefined){

    var webserver = require('./webserver');

    var Data = function() {

        this.store = {};

    }

    Data.prototype.save = function(id, name, value){

        this.store[id] = this.store[id] || {};
        this.store[id][name] = value;
        webserver.emit(name, value);

    }

    module.exports = new Data();

}).call(this);
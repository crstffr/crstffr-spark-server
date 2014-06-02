(function(undefined){

    var express = require("express");
    var socket = require('socket.io');
    var log = require('../utils/log').server;

    function Webserver() {

        var exp = express();
        var server = exp.listen(4000);
        this.io = socket.listen(server);
        this.sockets = [];

        log('***************************************');
        log('Web UI started at: http://lillipu1:4000');
        log('***************************************');

        exp.use(express.static(__dirname + '/../../public'))
           .get('/', function(request, response) {
               response.sendfile("index.html");
        });

        this.io.sockets.on('connection', function (socket) {

            socket.emit('test', 'what the fuck');
            this.sockets.push(socket);

        }.bind(this));

    }

    Webserver.prototype.emit = function(event, data) {
        for (var i = 0; i < this.sockets.length; i++) {
            this.sockets[i].emit(event, data);
        }
    }

    module.exports = new Webserver();

}).call(this);
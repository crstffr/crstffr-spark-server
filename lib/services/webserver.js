(function (undefined) {

    var express = require("express");
    var log = require('../utils/log').server;

    function Webserver() {

        var app = express();
        var http = require('http').Server(app);
        var io = require('socket.io')(http);
        var socketListeners = [];

        http.listen(4000, function () {
            log('****************************************');
            log('Web UI started at: http://lilliput1:4000');
            log('****************************************');
        });

        app.use(express.static(__dirname + '/../../public'))
            .get('/', function (request, response) {
                response.sendfile("index.html");
            });

        this.io = io;

        io.on('connection', function(socket) {
            log("Socket connection: ", socket.id);

            socket.on('', function(data){
                log("any message????", data);
            });

        });

    }

    module.exports = new Webserver();

}).call(this);
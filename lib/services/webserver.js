(function(undefined){

    var express = require("express");
    var log = require('../utils/log').server;

    function Webserver() {

        var exp = express();
        var server = exp.listen(4000);

        log('***************************************');
        log('Web UI started at: http://lillipu1:4000');
        log('***************************************');

        exp.use(express.static(__dirname + '/../../public'))
           .get('/', function(request, response) {
               response.sendfile("index.html");
        });

    }

    module.exports = new Webserver();

}).call(this);
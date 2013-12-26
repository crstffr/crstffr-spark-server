(function(){

    module.exports = {
        debug: true,
        logLevel: 'spark',
        log: function(who){
            return this.logLevel.indexOf(who) > -1;
        },
        tcp: {
            port: 5000,
            keepAlive: true,
            heartbeat: 5000,
        },
        logger: {
            firebase: {
                id: 'spark-logger',
                logs: '/logs/'
            }
        },
        spark: {
            token: '<token>',
            cores: [
                '<coreid>'
            ]
        },
        spotimote: {
            server: '<ipaddress>',
            debug: false
        }
    };

}).call(this);





(function(){

    module.exports = {
        debug: true,
        logLevel: 'spark,tcp,keepAlive',

        tcp: {
            port: 5000,
            msgTimeout: 1200,
            connTimeout: 11000,
            keepAlive: true,
            heartbeat: 10000
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
                '<core1>',
                '<core2>',
                '<etc>'
            ]
        },
        spotimote: {
            server: '192.168.0.114',
            debug: false
        },


        // Helper to parse the logLevel string
        // @todo - find a better place for this
        log: function(who){
            return this.logLevel.indexOf(who) > -1;
        }
    };

}).call(this);





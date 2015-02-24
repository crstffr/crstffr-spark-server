Lyre.factory('Socket', [function () {

    function Socket() {

        this.socket = false;

        this.connect = function () {

            if (this.socket) {

                this.socket.connect();

            } else {

                this.socket = io.connect();

                this.socket.on('connect', function () {
                    // console.log('Socket Connected');
                }.bind(this));

                this.socket.on('disconnect', function () {
                    // console.log('Socket Disconnected');
                }.bind(this));

                return this.socket;

            }

        };

        this.emit = function(msg, data) {
            if (!this.socket) {
                console.warn("socket not defined yet on emit: ", msg);
            } else {
                this.socket.emit(msg, data);
            }
        };

        this.on = function(msg, fn) {
            if (!this.socket) {
                console.warn("socket not defined yet on bind: ", msg);
            } else {
                this.socket.on(msg, fn);
            }
        };

        this.disconnect = function() {
            if (this.socket) { this.socket.disconnect(); }
        }
    }

    return new Socket();

}]);
Lyre.controller('MainCtrl', ['$scope', '$timeout', 'Socket', 'User',
    function($scope, $timeout, Socket, User) {

        this.server = {
            online: true,
            lastOnline: new Date()
        };

        User.server.on('value', function(data) {
            data = data.val();

            $timeout(function() {
                this.server.online = (data.online === 'true');
                this.server.lastOnline = data.lastOnline * 1000;
                (this.server.online) ? Socket.connect() : Socket.disconnect();
            }.bind(this));

        }.bind(this));

    }
]);
Lyre.controller('MainCtrl', ['$scope', '$timeout', 'User',
    function($scope, $timeout, User) {

        this.server = {
            online: true,
            lastOnline: new Date()
        };

        User.server.on('value', function(data) {
            data = data.val();
            $timeout(function() {
                this.server.online = (data.online === 'true');
                this.server.lastOnline = data.lastOnline * 1000;
            }.bind(this));
        }.bind(this));

    }
]);
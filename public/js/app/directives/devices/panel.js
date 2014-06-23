Lyre.directive('lyreDevicePanel', ['User', function(User) {

    return {
        scope: {},
        templateUrl: 'views/panel.html',
        link: function($scope, $element, $attrs) {

            var id = $attrs.deviceId;
            var device = User.devices.child(id);

            console.log("PANEL SCOPE", $scope);

            $scope.id = id;
            $scope.connected = false;

            device.on('value', function(data) {

                data = data.val();

                $scope.connected = (data.components.network.connected === 'true');

                setTimeout(function() {
                    $scope.$apply();
                }, 0);

            });

        }

    }

}]);
Lyre.directive('lyreDeviceAudio', ['User', function(User) {

    return {
        templateUrl: 'views/audio.html',
        link: function($scope, $element, $attrs) {

            var id = $attrs.deviceId;
            var $knob = $element.find(".volume");
            var device = User.devices.child(id);

            $knob.knob({
                min: 0,
                max: 64,
                change: function(value) {
                    var val = parseInt(value) + '';
                    device.child('components/volume/level').set(val)
                }

            });

            $scope.id = id;
            $scope.connected = false;

            $scope.$watch('volume', function(value) {
                $knob.trigger('change');
            });

            $scope.$watch('power', function(value, oldvalue) {
                if (angular.isDefined(oldvalue)) {
                    var val = (value) ? "on" : "off";
                    device.child('components/power/state').set(val);
                }
            });

            $scope.connect = function() {
                device.child('components/network/connected').set('retry');
            }

            device.on('value', function(data) {

                data = data.val();
                var components = data.components;

                $scope.volume = components.volume.level;
                $scope.power = (components.power.state === 'on');
                $scope.connected = (components.network.connected === 'true');

                setTimeout(function() {
                    $scope.$apply();
                }, 0);

            });

        }

    }

}]);
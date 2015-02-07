Lyre.directive('lyreDeviceAudio', ['User', function(User) {

    return {
        scope: {},
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
                    device.child('components/amp/volume').set(val)
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
                    device.child('components/amp/power').set(val);
                }
            });

            $scope.connect = function() {
                device.child('components/network/connected').set('retry');
            };

            device.on('value', function(data) {

                data = data.val();
                var components = data.components;

                $scope.volume = components.amp.volume;
                $scope.power = (components.amp.power === 'on');
                $scope.connected = (components.network.connected === 'true');

                setTimeout(function() {
                    $scope.$apply();
                }, 0);

            });

        }

    }

}]);
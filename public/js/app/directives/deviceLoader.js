Lyre.directive('deviceLoader', ['$compile', 'User', function ($compile, User) {

    return {

        link: function ($scope, $element, $attrs) {

            User.devices.once('value', function (data) {

                var devices = data.val();

                angular.forEach(devices, function initDevice(device, id) {

                    var elem = '<div lyre-device-' + device.type + ' device-id="' + id + '"></div>';

                    if (device.components && device.components.network) {

                        // Put connected devices at the top, disconnected devices at the bottom

                        if (device.components.network.connected == 'true') {

                            $($element[0]).prepend(elem);

                        } else {

                            $($element[0]).append(elem);

                        }

                    }

                    $compile($element.contents())($scope);

                });
            });
        }
    }

}]);

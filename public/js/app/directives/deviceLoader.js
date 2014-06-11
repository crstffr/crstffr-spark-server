Lyre.directive('deviceLoader', ['$compile', 'User', function($compile, User) {

    return {

        link: function($scope, $element, $attrs) {

            console.log("LOAD DEVICES ASSHOLES");

            User.devices.once('value', function(data) {

                var devices = data.val();

                angular.forEach(devices, function initDevice(device, id) {

                    $($element[0]).append('<div lyre-device-' + device.type + ' device-id="' + id + '"></div>');
                    $compile($element.contents())($scope);

                });
            });
        }
    }

}]);

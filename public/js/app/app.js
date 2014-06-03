
(function(){

    var Lyre = angular.module('Lyre', []);

    var Config = {

        fburl: 'https://lyre-dev.firebaseio.com/',
        user: 'crstffr',
        home: 'home'

    };

    /**
     *
     */
    Lyre.factory('User', function() {

        var root = new Firebase(Config.fburl),

            //root = $firebase(ref),

            user = root.child(Config.user),
            home = user.child(Config.home),
            rooms = home.child('rooms'),
            devices = home.child('devices');

        return {
            home: home,
            rooms: rooms,
            devices: devices
        };

    });

    Lyre.directive('lyreLoader', ['$compile', 'User', function($compile, User){

        return {
            link: function($scope, $element, $attrs) {

                User.devices.once('value', function(data){

                    var devices = data.val();

                    angular.forEach(devices, function initDevice(device, id) {

                        var html = '<div lyre-' + device.type + ' device-id="' + id + '">Hi Mom</div>';
                        var $device = Dom.create(html);
                        Dom.append($element[0], $device);

                        $compile($element.contents())($scope);

                    });



                });

            }
        }

    }]);


    Lyre.directive('lyreAudio', ['User', function(User){

        return {
            templateUrl: 'views/audio',
            link: function($scope, $element, $attrs) {

                $scope.id = $attrs.deviceId;

                var device = User.devices.child($scope.id);



                $scope.$watch('power', function(value, oldvalue) {
                    if (angular.isDefined(oldvalue)) {
                        var val = (value) ? "on" : "off";
                        device.child('components/power/state').set(val);
                    }
                });




                device.on('value', function(data){

                    var components = data.val().components;

                    $scope.power = (components.power.state === "on");
                    $scope.volume = components.volume.level;

                    setTimeout(function(){ $scope.$apply(); });

                });

            }

        }

    }])




}).call(this);

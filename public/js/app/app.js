
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


    Lyre.directive('lyreAudio', ['User', function(User){

        return {
            templateUrl: 'views/audio.html',
            link: function($scope, $element, $attrs) {

                var $knob = $element.find(".volume");

                $knob.knob({
                    min: 0,
                    max: 64,
                    change: function(value){
                        var val = parseInt(value);
                        device.child('components/volume/level').set(val)
                    }

                });

                $scope.id = $attrs.deviceId;

                var device = User.devices.child($scope.id);

                $scope.$watch('volume', function(value){
                    $knob.trigger('change');
                });

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

                    setTimeout(function(){ $scope.$apply(); }, 0);

                });

            }

        }

    }]);




}).call(this);

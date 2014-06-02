
var LyreApp = angular.module('LyreApp', []);


LyreApp.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

LyreApp.controller('TestCtrl', function ($scope, socket) {

    $scope.volume = 0;

    socket.on('test', function(value){
        console.log('TEST', value);
        $scope.test = value;
    })

    socket.on('volume', function(level){

        $scope.volume = level;

    });

});

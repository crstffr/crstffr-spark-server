Lyre.factory('User', ['Config', function(Config) {

    var root = new Firebase(Config.fburl),
        user = root.child(Config.user),
        home = user.child(Config.home),
        rooms = home.child('rooms'),
        devices = home.child('devices');

    return {
        home: home,
        rooms: rooms,
        devices: devices
    };

}]);
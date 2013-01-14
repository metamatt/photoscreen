function MainCtrl() {
    // nothing yet
}


function ContextChooserCtrl($scope, $http) {
    $http.get('/api/database').success(function(data) {
        $scope.num_photos = data.photos;
        $scope.num_directories = data.directories;
    })
}


function PhotoStripCtrl($scope, $http) {
    $scope.photos = [];
    $scope.current = 0;
    $http.get('/api/photos').success(function(data) {
        var digests = data.list;
        for (var i = 0; i < digests.length; i++) {
            var photo = { digest: digests[i], thumb: '/api/photos/' + digests[i] + '/thumbnail' };
            (function(photo) {
                $http.get('/api/photos/' + digests[i] + '/ratings').success(function(data) {
                    photo.all_ratings = data;
                    photo.my_rating = data['matt'] || 0;
                });
            })(photo);
            $scope.photos.push(photo);
        }
    });

    constrain_to_range = function(value, lower, upper) {
        return Math.max(lower, Math.min(upper, value));
    }

    change_selection = function(delta) {
        $scope.current = constrain_to_range($scope.current + delta, 0, $scope.photos.length - 1);
    }

    change_rating = function(delta) {
        var photo = $scope.photos[$scope.current];
        var oldRating = photo.my_rating;
        photo.my_rating = constrain_to_range(photo.my_rating + delta, -1, 1);
        if (photo.my_rating != oldRating) {
            $http.post('/api/photos/' + photo.digest + '/rate/' + photo.my_rating);
        }
    }

    document.onkeydown = function(event) {
        var handled = true;
        switch (event.keyIdentifier) {
            case "Left":
                change_selection(-1);
                break;
            case "Right":
                change_selection(+1);
                break;
            case "Up":
                change_rating(+1);
                break;
            case "Down":
                change_rating(-1);
                break;
            default:
                handled = false;
        }
        if (handled) {
            $scope.$digest();
        }
    }
}


angular.module('PhotoScreen', [], function($routeProvider, $locationProvider) {
   $routeProvider.when('/ratem', {
      templateUrl: '/static/partial/photostrip.html',
      controller: PhotoStripCtrl
   });
   $routeProvider.when('/', {
      templateUrl: '/static/partial/contextchooser.html',
      controller: ContextChooserCtrl
   });
 
   // configure html5 to get links working on jsfiddle
   $locationProvider.html5Mode(true);
});

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
            var photo = { thumb: '/api/photos/' + digests[i] + '/thumbnail', rating: 0 };
            $scope.photos.push(photo);
        }
    });

    document.onkeydown = function(event) {
        switch (event.keyIdentifier) {
            case "Left":
                if ($scope.current > 0) {
                    $scope.$apply($scope.current -= 1);
                }
                break;
            case "Right":
                if ($scope.current < $scope.photos.length - 1) {
                    $scope.$apply($scope.current += 1);
                }
                break;
            case "Up":
                $scope.$apply($scope.photos[$scope.current].rating++);
                break;
            case "Down":
                $scope.$apply($scope.photos[$scope.current].rating--);
                break;
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

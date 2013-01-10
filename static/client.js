function PhotoListCtrl($scope, $http) {
    $scope.photos = [];
    $scope.current = 0;
    $http.get('/api/photos').success(function(data) {
        var digests = data.list;
        for (var i = 0; i < digests.length; i++) {
            var photo = { thumb: '/api/photos/' + digests[i], rating: 0 };
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

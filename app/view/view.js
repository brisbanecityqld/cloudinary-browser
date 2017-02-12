'use strict';

angular.module('cloudinaryBrowser').config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('view', {
    url: '/view/:tag',
    templateUrl: 'view/view.html',
    controller: 'ViewCtrl',
    resolve: {
      images: function ($q, $rootScope, $stateParams, cloudinaryService) {
        var images = cloudinaryService.getImages($stateParams.tag);

        return images.images({}, function (v) {
          $rootScope.images = v.resources;
        });
      }
    }
  });
}])
    .controller('ViewCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {
      $scope.tag = $stateParams.tag;
    }]);

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
    .controller('ViewCtrl', ['$scope', '$stateParams', 'BCC_CONFIG', function ($scope, $stateParams, BCC_CONFIG) {
      $scope.tag = $stateParams.tag;
      $scope.downloadSizes = BCC_CONFIG.downloadSizes;
      $scope.urlBase = '//res.cloudinary.com/' + BCC_CONFIG.cloud_name + '/image';

      $scope.downloadSize = function (value) {
        if (value.indexOf('x') !== -1) {
          var vals = value.split('x');

          var transformations = [
            'w_' + vals[0],
            'h_' + vals[1],
            'c_fill'
          ];

          $scope.transformations = transformations.join(',');
        }
      };
    }]);

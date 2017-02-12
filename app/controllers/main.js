'use strict';

angular.module('cloudinaryBrowser').controller('MainCtrl', ['$state', function ($state) {
  this.go = function (route) {
    $state.go(route);
  };
}]);


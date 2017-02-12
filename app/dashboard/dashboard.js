'use strict';

angular.module('cloudinaryBrowser').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('dashboard', {
      url: '/dashboard',
      templateUrl: 'dashboard/dashboard.html',
      controller: 'DashboardCtrl'
    });
  }]).controller('DashboardCtrl', [function () {
}]);


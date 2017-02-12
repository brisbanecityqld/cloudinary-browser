'use strict';

angular.module('cloudinaryBrowser').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('dashboard', {
      url: '/dashboard',
      templateUrl: 'dashboard/dashboard.html',
      controller: 'DashboardCtrl'
    });
  }]).controller('DashboardCtrl', ['$state', 'BCC_CONFIG', function ($state, BCC_CONFIG) {
  this.bcc = {
    tags: BCC_CONFIG.tags
  };
}]);


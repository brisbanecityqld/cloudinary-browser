'use strict';

angular.module('cloudinaryBrowser').controller('MainCtrl', ['$state', 'BCC_CONFIG', function ($state, BCC_CONFIG) {
  this.go = function (route) {
    $state.go(route);
  };
  this.bcc = {
    tags: BCC_CONFIG.tags
  };
}]);


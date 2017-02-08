'use strict';

/**
 * @ngdoc overview
 * @name cloudinaryBrowserApp
 * @description
 * # cloudinaryBrowserApp
 *
 * Main module of the application.
 */
angular
  .module('cloudinaryBrowserApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

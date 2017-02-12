'use strict';

// Declare app level module which depends on views, and components
angular.module('cloudinaryBrowser', [
  'ngMaterial',
  'ngResource',
  'ui.router',
  'cloudinary'
]).config(['$locationProvider', '$urlRouterProvider', 'cloudinaryProvider', function($locationProvider, $urlRouterProvider, cloudinaryProvider) {

  cloudinaryProvider.set('cloud_name', 'brisbanecity');

  $locationProvider.hashPrefix('!');

  $urlRouterProvider.otherwise('/dashboard');
}]).constant("BCC_CONFIG", {
  'tags': [
      'myphotoalbum',
      'flowers'
  ]
});

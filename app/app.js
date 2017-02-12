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
  'cloud_name': 'brisbanecity',
  'tags': [
    'myphotoalbum',
    'flowers'
  ],
  'downloadSizes': [
    'original',
    '320x240',
    '640x480',
    '800x600',
    '1024x768',
    '1280x960',
    '1600x1200'
  ]
});

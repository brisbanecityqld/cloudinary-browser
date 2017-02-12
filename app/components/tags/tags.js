'use strict';

angular.module('cloudinaryBrowser').component('tagList', {
  templateUrl: './components/tags/tags.html',
  controller: 'TagCtrl',
  bindings: {
    tags: '='
  }
}).controller('TagCtrl', [function() {
  this.selectedTag = '';
}]);

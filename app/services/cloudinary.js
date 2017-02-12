/**
 * Created by cameron on 10/2/17.
 */

'use strict';

angular.module('cloudinaryBrowser').factory('cloudinaryService', ['$http', '$resource', 'cloudinary',
  function ($http, $resource, cloudinary) {
    return {
      getImages: function (tag) {
        var url = cloudinary.url(tag, {format: 'json', type: 'list'});
        //cache bust
        url = url + "?" + Math.ceil(new Date().getTime() / 1000);
        return $resource(url, {}, {
          images: {method: 'GET', isArray: false}
        });
      }
    };
  }]);

angular.module('collaby.tasks', [])

.controller('tasksController', function ($scope) {


});


/* Example from Shortly-angular. This is the controller for the filterable list of links:

angular.module('shortly.links', [])

.controller('LinksController', function ($scope, Links) {
  $scope.data = {
    links: []
  };
  $scope.getLinks = function(){
    Links.getLinks($scope.data.links);
  };
  $scope.getLinks();
})
.factory('Links', function Links ($http) {
  var data = {};
  var getLinks = function() {
    return $http({
      method: 'GET',
      url: '/api/links'
    })
    .then(function (result) {
      data.links = result.data;
      return data.links;
    });
  };

  return {
    data: data,
    getLinks: getLinks
  };
});

*/
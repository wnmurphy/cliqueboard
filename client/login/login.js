angular.module('twork.login', [])

.controller('loginController', function ($scope, logInUserInfo) {
  angular.extend($scope, logInUserInfo);
})
.factory('logInUserInfo', function($http, $location, $rootScope) {
	
	var holdUserName;

  var requestUser = function(username, password) {
     holdUserName = username;

     return $http({
       method: 'POST',
       url: '/login',
       data: {
         username: username,
         password: password
       }
      }).success(function(res, status) {
        $rootScope.loggedInUser = holdUserName;
        $location.path('/');
      })
      .error(function(err) {
        $location.path('/login');
      });
  };

	return {
		requestUser: requestUser,
		holdUserName: holdUserName
	}
});


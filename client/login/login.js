angular.module('twork.login', [])

.controller('loginController', function ($scope, logInUserInfo) {
  angular.extend($scope, logInUserInfo);
})
.factory('logInUserInfo', function($http, $location, $rootScope) {
	
	var userData = [];

  var requestUser = function(username, password) {
     return $http({
       method: 'POST',
       url: '/login',
       data: {
         username: username,
         password: password
       }
      }).success(function(res, status) {
        userData.push(res.data);
        $rootScope.loggedInUser = res.data;
        $location.path('/');
      })
      .error(function(err) {
        $location.path('/login');
      });
  };

	return {
		requestUser: requestUser,
		userData: userData
	}
});


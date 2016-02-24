angular.module('twork.login', [])

.controller('loginController', function ($scope, logInUserInfo) {
  angular.extend($scope, logInUserInfo);
})
.factory('logInUserInfo', function($http) {
	
	var userData = [];

  var requestUser = function(username, password) {
    return $http({
      method: 'POST',
      url: '/login',
      data: {
        username: username,
        password: password
      }
    })
    .success(function(resp, status) {
      userData.push(resp.data);
      // $location.url('/')
    })
    .error(function(err) {
      console.error('Login error:', err);
    });
  };

	return{
		requestUser: requestUser,
		userData: userData
	}
});


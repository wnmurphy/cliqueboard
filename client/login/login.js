angular.module('twork.login', [])

.controller('loginController', function ($scope, logInUserInfo) {
  angular.extend($scope, logInUserInfo);
})
.factory('logInUserInfo', function($http, $location) {
	
	var userData = [];

  var requestUser = function(username, password) {
    var data = {
      username: username,
      password: password
    };

    return $http.post('/login', data)
      .then(function(res, status) {
        userData.push(resp.data);
        $location.path('/');
      })
      .catch(function(err) {
        $location.path('/login');
      });
  };

	return {
		requestUser: requestUser,
		userData: userData
	}
});


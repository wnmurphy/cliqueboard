angular.module('twork.signup', [])

.controller('signupController', function ($scope, signUpInfo) {
  angular.extend($scope, signUpInfo);

})
.factory('signUpInfo', function($http) {
	
	var signUpData = [];

	var signUp = function(email, user, password) {
		signUpData.push({email: email, username: user, password: password});
	}

	var holdUser = {};

  var createUser = function(email, username, password) {
    return $http({
      method: 'POST',
      url: '/signup',
      data: {
        username: username,
        email: email,
        password: password
      }
    })
    .success(function(resp, status) {
      holdUser = resp.data;
    }).error(function(err) {
      console.error('Error posting user:', err)
    });
  };


	return {
		signUp: signUp,
		signUpData: signUpData,
		createUser: createUser,
		holdUser: holdUser
	}
});

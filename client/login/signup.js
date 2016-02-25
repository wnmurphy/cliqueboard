angular.module('twork.signup', [])

.controller('signupController', function ($scope, signUpInfo) {
  angular.extend($scope, signUpInfo);

})
.factory('signUpInfo', function($http, $location) {
	
	var signUpData = [];

	var signUp = function(email, user, password) {
		signUpData.push({email: email, username: user, password: password});
	}

	var holdUser = {};

  var createUser = function(email, username, password) {
    var data = {
      username: username,
      email: email,
      password: password
    };

    return $http.post('/signup', data)
      .then(function(resp, status) {
        holdUser = resp.data;
        $location.path('/');
      })
      .catch(function(err) {
        $location.path('/signup');
      });
  };

	return {
		signUp: signUp,
		signUpData: signUpData,
		createUser: createUser,
		holdUser: holdUser
	}
});

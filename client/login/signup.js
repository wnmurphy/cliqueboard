angular.module('twork.signup', [])

.controller('signupController', function ($scope, signUpInfo) {
  angular.extend($scope, signUpInfo);

})
.factory('signUpInfo', function($http){
	
	var signUpData = [];

	var signUp = function(email, user, password){
		signUpData.push({email: email, username: user, password: password});
	}

	var holdUser = {};
  var createUser = function(email, username, password){
    console.log("email", email);
    console.log("name", username);
    console.log("password", password);
    return $http({
      method: 'POST',
      url: '127.0.0.1:4568', //<-----------update this before deployment
      // url: 'heroku.triceratops.com/signup',
      data: {
        email: email,
        username: username,
        password: password
      }
    })
    .success(function(resp, status){
      holdUser = resp.data;
    }).error(function(err) {
      console.log('error', err)
    });
  };


	return{
		signUp: signUp,
		signUpData: signUpData,
		createUser: createUser,
		holdUser: holdUser
	}
});

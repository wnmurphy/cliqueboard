angular.module('twork.signup', [])

.controller('signupController', function ($scope, signUpInfo) {
  angular.extend($scope, signUpInfo);

})
.factory('signUpInfo', function($http, $location, $rootScope) {
	
	var signUpData = [];

	var signUp = function(email, user, password) {
		signUpData.push({email: email, username: user, password: password});
	}

	var holdUserName;

  var createUser = function(email, username, password) {
     holdUserName = username;

     return $http({
       method: 'POST',
       url: '/signup',
       data: {
         username: username,
         email: email,
         password: password
       }
     }).success(function(res, status) {
       $rootScope.loggedInUser = holdUserName;
       console.log($rootScope);
       $location.path('/');
     }).error(function(err) {
      $location.path('/signup');
     });
  };

  return {
    signUp: signUp,
    signUpData: signUpData,
    createUser: createUser,
    holdUserName: holdUserName
  }
});

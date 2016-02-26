angular.module('twork.signup', [])

.controller('signupController', function ($scope, signUpInfo) {
  angular.extend($scope, signUpInfo);

})
.factory('signUpInfo', function($http, $location, $rootScope) {
	
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
       $location.path('/');
     }).error(function(err) {
      $location.path('/signup');
     });
  };

  return {
    createUser: createUser,
    holdUserName: holdUserName
  }
});

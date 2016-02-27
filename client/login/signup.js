angular.module('twork.signup', [])

.controller('signupController', function ($scope, signUpInfo) {
  angular.extend($scope, signUpInfo);

})
.factory('signUpInfo', function($http, $location, $rootScope) {

	var holdUserName;

  var createUser = function(email, username, password) {
     holdUserName = username;

      var data = {
         email: email,
         username: username,
         password: password
       };

       return $http.post('/signup', data)
         .then(function(resp, status) {
           $rootScope.loggedInUser = holdUserName
           $location.path('/');
         })
         .catch(function(err) {
           $location.path('/signup');
         });
      };




  return {
    createUser: createUser,
    holdUserName: holdUserName
  }
});

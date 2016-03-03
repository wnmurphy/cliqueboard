angular.module('twork.login', [])

.controller('loginController', function ($scope, $rootScope, logInUserInfo) {
  angular.extend($scope, logInUserInfo);
})
.factory('logInUserInfo', function($http, $location, $rootScope) {
////add a comment
	var holdUserName;

  var requestUser = function(username, password) {
     holdUserName = username;

  var data = {
       username: username,
       password: password
       };

      // Attempt to log in
      return $http.post('/login', data)
       .then(function(res, status) {
         // If successful, add username to $rootScope.
         $rootScope.loggedInUser = holdUserName;
         // Send to main view.
         $location.path('/');
       })
       .catch(function(err) {
         // If unsuccessful, send user to login screen.
         $location.path('/login');
       });
    };

  // Logout user by removing username from $rootScope.
  var logoutUser = function(){
    $rootScope.loggedInUser = undefined;
    $location.path('/login');
  };

	return {
		requestUser: requestUser,
		holdUserName: holdUserName,
    logoutUser: logoutUser,
	}
});

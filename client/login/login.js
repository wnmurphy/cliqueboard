angular.module('twork.login', [])

.controller('loginController', function ($scope, $rootScope, logInUserInfo) {
  angular.extend($scope, logInUserInfo);
})
.factory('logInUserInfo', function($http, $location, $rootScope) {

	var holdUserName;

  var requestUser = function(username, password) {
     holdUserName = username;

  var data = {
       username: username,
       password: password
       };

      return $http.post('/login', data)
       .then(function(res, status) {
         $rootScope.loggedInUser = holdUserName;
         $location.path('/');
       })
       .catch(function(err) {
         $location.path('/login');
       });
    };

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

angular.module('collaby.login', [])

.controller('loginController', function ($scope, logInUserInfo) {
  angular.extend($scope, logInUserInfo);
})
.factory('logInUserInfo', function(){
	
	var userData = [];

	var logIn = function(user, password){
		userData.push({username: user, password: password});
	}
	return{
		logIn: logIn,
		userData: userData,
	}
});


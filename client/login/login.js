angular.module('twork.login', [])

.controller('loginController', function ($scope, logInUserInfo) {
  angular.extend($scope, logInUserInfo);
})
.factory('logInUserInfo', function(){
	
	var userData = [];

  var requestUser = function(){
    return $http({
      method: 'GET',
      url: '/login'
    })
    .success(function(resp, status){
      userData.push(resp.data);
    }).error(function(err) {
      console.log('error', err);
    });
  };

	return{
		requestUser: requestUser,
		userData: userData
	}
});


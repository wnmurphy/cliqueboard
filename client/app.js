// Declare app level module which depends on views, and components
angular.module('twork', [
  'ngRoute',
  'twork.chat',
  'twork.tasks',
  'twork.whiteboard',
  'twork.login',
  'twork.signup'
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/chat', {
      templateUrl: 'v.chat/chat.html',
      controller: 'chatController',
    })
    .when('/tasks', {
      templateUrl: 'v.tasks/tasks.html',
      controller: 'tasksController'
    })
    .when('/login', {
      templateUrl: 'login/loginView.html',
      controller: 'loginController'
    })
    .when('/signup', {
      templateUrl: 'login/signupView.html',
      controller: 'signupController'
    })
    ///Interjects before each route change to checkSession
    // $httpProvider.interceptors.push('checkSession');
})
/////Having trouble building a factor that will check for session before each page change//
.factory('checkSession', function($window, cb, $http){
    var checkUser = function(){
    return $http({
      method: 'GET',
      url: '/login', //<-----------update this before deployment
      // url: 'heroku.triceratops.com/signup',
    })
    .success(function(resp, status){
      if(resp.data === session){
        
      };
    }).error(function(err) {
      console.log('error', err);
    });
  };
});
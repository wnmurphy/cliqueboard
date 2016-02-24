
// Declare app level module which depends on views, and components
angular.module('twork', [
  'ngRoute',
  'twork.chat',
  'twork.tasks',
  'twork.whiteboard',
  'twork.login',
  'twork.signup'
])
.config(function($routeProvider) {
  $routeProvider
    .when('/chat', {
      templateUrl: 'v.chat/chat.html',
      controller: 'chatController'
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
});
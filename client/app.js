
// Declare app level module which depends on views, and components
angular.module('collaby', [
  'ngRoute',
  'collaby.chat',
  'collaby.tasks',
  'collaby.whiteboard',
  'collaby.login',
  'collaby.signup'
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
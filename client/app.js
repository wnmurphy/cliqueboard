
// Declare app level module which depends on views, and components
angular.module('collaby', [
  'ngRoute',
  'collaby.chat',
  'collaby.tasks',
  'collaby.whiteboard'
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
});
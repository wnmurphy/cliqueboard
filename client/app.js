
// Declare app level module which depends on views, and components
angular.module('collaby', [
  'ngRoute',
  'collaby.whiteboard',
  'collaby.tasks'
  // 'collaby.chat'
])
.config(function($routeProvider) {
  $routeProvider
    .when('/whiteboard', {
      templateUrl: 'v.whiteboard/whiteboard.html',
      controller: 'whiteboardController'
    })
    .when('/tasks', {
      templateUrl: 'v.tasks/tasks.html',
      controller: 'tasksController'
    })
   
});
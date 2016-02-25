// Declare app level module which depends on views, and components
angular.module('twork', [
  'ngRoute',
  'twork.chat',
  'twork.tasks',
  'twork.whiteboard',
  'twork.login',
  'twork.signup'
])
.config(function($routeProvider, $locationProvider) {
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
    });
    ///Interjects before each route change to checkSession
    // $httpProvider.interceptors.push('checkSession');
});
// .run(function ($rootScope, $location, Auth) {
//   $rootScope.$on('$routeChangeStart', function (evt, next, current) {
//     if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
//       $location.path('/signin');
//     }
//   });
// });






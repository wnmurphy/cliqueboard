// Declare app level module which depends on views, and components
angular.module('twork', [
  'ngRoute',
  'twork.login',
  'twork.signup',
  'twork.main'
])
.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'login/loginView-old.html',
      controller: 'loginController'
    })
    .when('/signup', {
      templateUrl: 'login/signupView-old.html',
      controller: 'signupController'
    })
    .when('/', {
      templateUrl: 'main/mainView.html'
    });
    // $httpProvider.interceptors.push('CheckSession');
})
// .factory('CheckSession', function ($window) {

//   var checkSession = {
//     request: function (object) {
//       // GET current session
//       // check if it's valid
//       //return true or false
//     }
//   };
//   return checkSession;
// })
.run(function ($rootScope, $location) {
  console.log('$rootScope ', $rootScope);
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if ($rootScope.loggedInUser === null) {
      $location.path('/login');
    }
  });
});

// app.controller("LoginCtrl", function($scope, $location, $rootScope) {
//   $scope.login = function() {
//     $rootScope.loggedInUser = $scope.username;
//     $location.path("/persons");
//   };
// });


//   run(function($rootScope, $location) {
//     $rootScope.$on( "$routeChangeStart", function(event, next, current) {
//       if ($rootScope.loggedInUser == null) {

//         // no logged user, redirect to /login
//         if ( next.templateUrl === "partials/login.html") {

//         } else {
//           $location.path("/login");
//         }
//       }
//     });
//   });
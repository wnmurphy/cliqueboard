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
      templateUrl: 'login/loginView.html',
      controller: 'loginController'
    })
    .when('/signup', {
      templateUrl: 'login/signupView.html',
      controller: 'signupController'
    })
    .when('/', {
      templateUrl: 'main/mainView.html'
    });
    //$httpProvider.interceptors.push('CheckSession');
});
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
// .run(function ($rootScope, $location, Auth) {
//   // here inside the run phase of angular, our services and controllers
//   // have just been registered and our app is ready
//   // however, we want to make sure the user is authorized
//   // we listen for when angular is trying to change routes
//   // when it does change routes, we then look for the token in localstorage
//   // and send that token to the server to see if it is a real user or hasn't expired
//   // if it's not valid, we then redirect back to signin/signup
//   $rootScope.$on('$routeChangeStart', function (evt, next, current) {
//     if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
//       $location.path('/signin');
//     }
//   });
// });
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
})
.run(function ($rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!$rootScope.loggedInUser && ($location.path() !== '/signup')) {
      $location.path('/login');
    }
  });
});
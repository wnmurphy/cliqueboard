angular.module('twork', [
  'ngRoute',
  'twork.login',
  'twork.signup',
  'twork.main',
  'ui.materialize'
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
})
.run(function ($rootScope, $location) {
  // Check for user authentication on any re-reroute.
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!$rootScope.loggedInUser && ($location.path() !== '/signup')) {
      $location.path('/login');
    }
  });
});
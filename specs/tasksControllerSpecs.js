describe('tasksController', function () {
  var $scope, $rootScope, tasksController, $httpBackend;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('collaby.tasks'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('tasksController', {
        $scope: $scope,
      });
    };
  }));

  it('should have an fetchTasks method on the $scope', function() {
    createController();
    expect($scope.fetchTasks).to.be.a('function');
  });

  it('should have an addTasks method on the $scope', function() {
      createController();
      expect($scope.addTasks).to.be.a('function');
  });

  it('should have a tasks array on the $scope', function() {
      createController();
      expect($scope.tasks).to.be.an('array');
  });

  it('should have an completeTasks method on the $scope', function() {
      createController();
      expect($scope.completeTasks).to.be.a('function');
  });

});
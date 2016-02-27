describe('tasksController', function () {
  var $scope, $rootScope, createController, $httpBackend, Tasks;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('twork'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    Tasks = $injector.get('Tasks');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('tasksController', {
        $scope: $scope,
        Tasks: Tasks
      });
    };
  }));



  it('should have a toggle method on the $scope', function() {
    createController();
    expect($scope.toggle).to.be.a('function');
  });

  it('should have an addTasks method on the $scope', function() {
      createController();
      expect($scope.addTasks).to.be.a('function');
  });

  it('should have a tasks array on the $scope', function() {
      createController();
      expect($scope.tasks).to.be.an('array');
  });

  it('should have a delete method on the $scope', function() {
      createController();
      expect($scope.delete).to.be.a('function');
  });

});
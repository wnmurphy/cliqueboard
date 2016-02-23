angular.module('collaby.tasks', [])

.controller('tasksController', function ($scope, $http) {
  
  $scope.tasks = [];

  $scope.fetchTasks = function() { //<---------call fetch everytime new task is submitted
    return $http({
      method: 'GET',
      url: 'TBD'  // <---------- update once database exists
    })
    .then(function(result) {
      $scope.tasks = result.data;
      return $scope.tasks;
    });
  };

  $scope.addTask = function(name, due) {
    
    // parse dueDate because it will in ISO format
    dueDate = dueDate.toLocaleString();

    // empty task and date input field
    $scope.task = '';
    $scope.datetime = '';

    var task = {
      name: taskName,
      created: new Date(Date.now()).toLocaleString(),
      due: dueDate,
      complete: false
    };

    $scope.tasks.push(task);
  };

  $scope.completeTask = function(index){
    $scope.tasks.splice(index, 1); //<---------------- PUT request to remove one task from database
  };

});

// create a new socket event 'newTask' to emit whenever , which triggers fetchTasks()
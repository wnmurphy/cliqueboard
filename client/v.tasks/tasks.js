angular.module('collaby.tasks', [])

.controller('tasksController', function ($scope, $http, Tasks) {
  angular.extend($scope, Tasks);

  $scope.addTask = function(name, due, urgency) {
    if (due !== undefined) {
      due = $scope.formatDate(due, true);
    } else {
      due = 'N/A';
    }

    urgency = urgency || 'Not Urgent';

    // empty task and date input field after entry
    $scope.task = '';
    $scope.datetime = '';

    var task = {
      name: name,
      created: $scope.formatDate(new Date(Date.now()), false),
      due: due,
      urgency: urgency,
      complete: false
    };

    $scope.tasks.push(task);
    $scope.incomplete.push(task);
  };

})
.factory('Tasks', function() {

  var obj = {

    view: 'all',

    tasks: [],
    completed: [],
    incomplete: [],

    incompleteCheck: function() {
      obj.tasks.forEach(function(task) {
        obj.incomplete.forEach(function(incTask) {
          if (!task.complete && incTask.name !== task.name) {
            obj.incomplete.push(task);
          }
        });
      });
    },

    // fetchTasks: function() { //<---------call fetch everytime new task is submitted
    //   return $http({
    //     method: 'GET',
    //     url: 'TBD'  // <---------- update once database exists
    //   })
    //   .then(function(result) {
    //     tasks = result.data;
    //     return tasks;
    //   });
    // },

    formatDate: function(dateStr, due) {
      // the due parameter is just a flag for whether the date
      // is under the "due" column or the "created" column

      var rawDate = new Date(dateStr);

      // parsing the date, month, hour, and minutes
      var day = rawDate.getDate();
      var month = rawDate.getMonth() + 1 + '/';

      // keeping the hour format to 12 hour instead of 24
      var hour = rawDate.getHours() > 12 ? 
        rawDate.getHours() - 12 + ':' : 
        rawDate.getHours() + ':';
      var minutes = rawDate.getMinutes().toString().length < 2 ? 
        '0' + rawDate.getMinutes() :
        rawDate.getMinutes();

      // concattenating the formatted pieces
      var date = due ?
        month + day :
        month + day + ' at ' + hour + minutes;

      return date;
    },

    deleteTask: function(index, collection) {
      var task = obj[collection][index];
      if (task.complete === true) {
        obj[collection].splice(index, 1);
      } else {
        task.complete = true;
        obj.completed.push(task);
        obj.tasks.splice(index, 1);
        obj.incomplete.splice(index, 1);
      }
    }

  };

  return obj;
});

// create a new socket event 'newTask' to emit whenever , which triggers fetchTasks()
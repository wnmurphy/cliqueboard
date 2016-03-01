angular.module('twork.main', [])


//====================== Whiteboard Controller ==================
.controller('whiteboardController', function ($scope) {
  $scope.name = 'whiteboard';
  $scope.color = "#000000";

  // Initialize HTML5 canvas, create new canvas element, append to .canvas div
  $scope.init = function() {
    this.canvas = document.createElement('canvas');
    this.canvas.height = $('.canvas').height();
    this.canvas.width = $('.canvas').width();
    document.getElementsByClassName('canvas')[0].appendChild(this.canvas);

    // Store the context
    this.ctx = this.canvas.getContext("2d");

    // Set preferences⁄ for the line drawing.
    this.ctx.fillStyle = "solid";
    this.ctx.strokeStyle = $scope.color;
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "round";

    // Update drawing color whenever color picker changes.
    var that = this;
    $('#colorpicker').change( function() {
      $scope.color = $('#colorpicker').val();
      that.ctx.strokeStyle = $scope.color;
    });
  };

  // Draw to canvas.
  $scope.draw = function(x, y, type, color) {
    // Set color property.
    this.ctx.strokeStyle = color;

    if (type === "dragstart") {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    } else if (type === "drag") {
      this.ctx.lineTo(x,y);
      this.ctx.stroke();
    } else {
      this.ctx.closePath();
    }
    return;
  };

  // Initialize canvas, per above.
  $scope.init();

  // Set up socket connection for incoming draw events.
  $scope.socket = io();

  // Create draw event listener which triggers local draw event.
  $scope.socket.on('draw', function(data) {
    $scope.draw(data.x, data.y, data.type, data.color);
  });

  // Create clear event listener.
  $scope.socket.on('clear', function(data) {
    $scope.remoteClear();
  });

  // Handle draw events.
  $('canvas').live('drag dragstart dragend', function(e) {
    var type = e.handleObj.type;
    var color = $scope.color;
    var offset = $(this).offset();

    // If you're having alignment problems, change 'page' here to 'client' or 'screen'.
    e.offsetX = e.pageX - offset.left;
    e.offsetY = e.pageY - offset.top;
    var x = e.offsetX;
    var y = e.offsetY;

    $scope.draw(x, y, type, color);
    $scope.socket.emit('drawClick', { x : x, y : y, type : type, color: color});
  });

  // Define a clear canvas function, which emits a clear event to other clients.
  $scope.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    $scope.socket.emit('clear');
  };

  // To avoid infinite emit/on loop, define a separate clear function for remote clear events.
  $scope.remoteClear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
})

//====================== Chat Controller ==================
.controller('chatController', function ($scope, $rootScope, $http, $compile) {
  var userInfo = $rootScope.userData;

  $scope.init = function() {

  };

  // Set up socket connection for incoming/outgoing chat events.
  $scope.socket = io();

 // Store username of the currently logged-in user.
  var userName = $rootScope.loggedInUser;

    $scope.socket.on('connect', function() {

      // Call the server-side function 'adduser' and send username.
      $scope.socket.emit('adduser', userName);
    });

  // Listen for updateusers event, empty user list, and rebuild.
  $scope.socket.on('updateusers', function(data) {
      $('#users').empty();
      $.each(data, function(key, value) {
          $('#users').append('<div>' + value + '</div>');
    });
  });

   // Append incoming message when server emits 'updatechat'.
   $scope.socket.on('updatechat', function (username, data) {
      // console.log('updatechat listener in controller reached');
      $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
    });

  // Socket events for multiple room functionality, currently unused, available as future feature:
  // listener, whenever the server emits 'updaterooms', this updates the room the client is in
    $scope.socket.on('updaterooms', function(rooms, current_room) {
      $('#rooms').empty();
      $.each(rooms, function(key, value) {

        if(value == current_room){
          $('#rooms').append('<li><a class="btn">' + value + '</a></li>');
        } else {
          var element = $compile(`<li><a class="btn" ng-click="switchRoom('${value}')">${value}</a></li>`)($scope);
          $('#rooms').append(element);
        }
      });
    });


    $scope.switchRoom = function(room) {
      console.log('switchRoom func in controller reached:', room);
      $scope.socket.emit('switchRoom', room);
    };

    $scope.inputFocus = function () {
      document.getElementById("data").focus();
    };
  // Submit message when Send button is clicked.
    $(function() {
    $('#datasend').click( function() {
      var message = $('#data').val()
      $('#data').val('');
      $scope.socket.emit('sendchat', message);
      // $http.post('/chat', message)
      //   .then(function(success) {
      //     console.log('Message POST successful');
      //     // tell server to execute 'sendchat' and send along one parameter
      //     $scope.socket.emit('sendchat', message);
      //   })
      //   .catch(function(err) {
      //     console.error('Message POST error:', err);
      //   });
     });

  // Submit message when Send button is clicked.
    $('#data').keypress(function(e) {
     if (e.which == 13) {
       $(this).blur();
       $('#datasend').focus().click();
       $('#data').focus();
     }
    });
  });
})

//====================== Tasks Controller ==================
.controller('tasksController', function ($scope, $http, Tasks) {
  angular.extend($scope, Tasks);

  $scope.socket = io();

  // Define listener for adding task.
  $scope.socket.on('add', function(task) {
    $scope.$apply(function() {
      $scope.tasks[task._id] = task;
      console.log('ADDED:', task);
    });
  });

  // Define listener for deleting task.
  $scope.socket.on('delete', function(taskId) {
    $scope.$apply(function() {
      delete $scope.tasks[taskId];
    });
  });

  $scope.socket.on('toggle', function(taskId, status) {
    $scope.$apply(function() {
      $scope.tasks[taskId].complete = status;
    });
  });

  // the task object is created to provide access to the input
  // field models in mainView.html at lines 24, 28, and 32
  $scope.task = {
    name: null,
    date: null,
    urgency: null
  };

  $scope.init = function() {
    $http.get('/tasks')
      .then(function(result) {
        result.data.forEach(function(task) {
          if (!$scope.tasks[task._id]) {
            $scope.tasks[task._id] = task;
            $scope.tasks[task._id].checked = $scope.tasks[task._id].complete;
          }
        });
        console.log('Task GET successful:', $scope.tasks);
      })
      .catch(function(err) {
        console.error('Task GET error:', err);
      });
  };

  $scope.init();

  $scope.addTask = function(name, due, urgency) {
    if (due !== undefined) {
      due = $scope.formatDate(due, true);
    } else {
      due = 'N/A';
    }

    urgency = urgency || 'Not Urgent';

    // Empty input fields after submission and reset form.
    $scope.task.name = null;
    $scope.task.date = null;
    $scope.task.urgency = null;
    $scope.createTask.$setPristine();

    var newTask = {
      name: name,
      created: $scope.formatDate(new Date(Date.now()), false),
      due: due,
      urgency: urgency,
      complete: false
    };

    $http.post('/tasks', newTask)
      .then(function(success) {
        console.log('Task POST successful:', success);
        if (!$scope.tasks[success.data._id]) {
          $scope.socket.emit('addTask', success.data);
          $scope.tasks[success.data._id] = success.data;
        }
      })
      .catch(function(err) {
        console.error('Task POST error:', err);
      });

  };

  $scope.toggle = function(task, key) {
    if (!task.complete) {
      task.complete = true;
      $http.put('/tasks/' + task._id + '/complete')
        .then(function(success) {
          $scope.socket.emit('toggleTask', task._id, true);
          console.log('Task PUT successful');
        })
        .catch(function(err) {
          console.error('Task PUT error:', err);
        });
    } else {
      task.complete = false;
      $http.put('/tasks/' + task._id + '/incomplete')
        .then(function(success) {
          $scope.socket.emit('toggleTask', task._id, false);
          console.log('Task PUT successful');
        })
        .catch(function(err) {
          console.error('Task PUT error:', err);
        });
    }
  };

  $scope.delete = function(task) {
    $http.delete('/tasks/' + task._id)
      .then(function(result) {
        $scope.socket.emit('deleteTask', task._id);
        console.log('Task DELETE successful');
      })
      .catch(function(err) {
        console.error('Task DELETE error:', err);
      });

    delete $scope.tasks[task._id];
  };

})
.factory('Tasks', function($http) {

  var obj = {

    tasks: {},

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

      // Angular-materialize's datepicker defaults to 12/31 if
      // no date is chosen
      if (date === '12/31') {
        date = 'N/A';
      }

      return date;
    }

  };

  return obj;

});

angular.module('twork.main', [])


//====================== Whiteboard Controller ==================
.controller('whiteboardController', function ($scope) {
  $scope.name = 'whiteboard';
  $scope.color = "#bada55";

  // Initialize HTML5 canvas, create new canvas element, append to .canvas div
  $scope.init = function() {
    this.canvas = document.createElement('canvas');
    this.canvas.height = $('.canvas').height();
    this.canvas.width = $('.canvas').width();
    document.getElementsByClassName('canvas')[0].appendChild(this.canvas);

    // Store the context
    this.ctx = this.canvas.getContext("2d");

    // Set preferences for the line drawing.
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

  //Draw to canvas
  $scope.draw = function(x, y, type, color) {
    //set color property
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

  //Run init
  $scope.init();

  //Set up socket connection for incoming draw events
  $scope.socket = io();

  // Create draw event listener which triggers local draw event.
  $scope.socket.on('draw', function(data) {
    $scope.draw(data.x, data.y, data.type, data.color);
  });

  // Create clear event listener
  $scope.socket.on('clear', function(data) {
    $scope.remoteClear();
  });

  //Handle draw events
  $('canvas').live('drag dragstart dragend', function(e) {
    var type = e.handleObj.type;
    var color = $scope.color;
    var offset = $(this).offset();
    //If you're having alignment problems, change 'page' here to 'client' or 'screen'.
    e.offsetX = e.pageX - offset.left;
    e.offsetY = e.pageY - offset.top;
    var x = e.offsetX;
    var y = e.offsetY;
    $scope.draw(x, y, type, color);
    $scope.socket.emit('drawClick', { x : x, y : y, type : type, color: color});
  });

  $scope.remoteClear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  $scope.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    $scope.socket.emit('clear');
  };
})

//====================== Chat Controller ==================
.controller('chatController', function ($scope, $rootScope) {
  var userInfo = $rootScope.userData;

  //creates an open connection for collobartive messaging
  //Set up socket connection for incoming/outgoing chat events
  $scope.socket = io();

 // Store username of the currently logged-in user
  var userName = $rootScope.loggedInUser;

    $scope.socket.on('connect', function() {

      // call the server-side function 'adduser' and send username
      $scope.socket.emit('adduser', userName);
    });


  $scope.socket.on('updateusers', function(data) {
      $('#users').empty();

      $.each(data, function(key, value) {
          $('#users').append('<div>' + value + '</div>');
    });
  });

   // Append incoming message when server emits 'updatechat'.
   $scope.socket.on('updatechat', function (username, data) {
      $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
    });



    // listener, whenever the server emits 'updaterooms', this updates the room the client is in
    // $scope.socket.on('updaterooms', function(rooms, current_room) {
    //   $('#rooms').empty();
    //   $.each(rooms, function(key, value) { //////Will this work with angular????????//////////
    //     if(value == current_room){
    //       $('#rooms').append('<div>' + value + '</div>');
    //     }
    //     else {
    //       $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
    //     }
    //   });
    // });

    // $scope.switchRoom = function(room){
    //   $scope.socket.emit('switchRoom', room);
    // }

 // $scope.socket.on('message', function (data) {
 //  console.log(data);
 // });

 // socket.emit('subscribe', 'roomOne');
 // socket.emit('subscribe', 'roomTwo');

 // $('#send').click(function() {
 //  var room = $('#room').val(),
 //   message = $('#message').val();

 //  socket.emit('send', { room: room, message: message });
 // });
    // on load of page
    $(function() {
    // when the client clicks SEND
    $('#datasend').click( function() {
      var message = $('#data').val();
      $('#data').val('');
      // tell server to execute 'sendchat' and send along one parameter
      $scope.socket.emit('sendchat', message);
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
      if (e.which == 13) {
        $(this).blur();
        $('#datasend').focus().click();
      }
    });
  });
})


//====================== Tasks Controller ==================
.controller('tasksController', function ($scope, $http, Tasks) {
  angular.extend($scope, Tasks);

  $scope.socket = io('http://localhost:4568');

  $scope.socket.on('add', function(task) {
    console.log('TASKS SOCKET ADD:', task);
    $scope.tasks.push(task);
  });

  $scope.init = function() {
    $http.get('/tasks')
      .then(function(result) {
        result.data.forEach(function(task) {
          $scope.tasks.push(task);
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

    // empty task and date input field after entry
    this.task = '';
    this.datetime = '';
    this.urgency = '';
    this.createTask.$setPristine();

    var task = {
      name: name,
      created: $scope.formatDate(new Date(Date.now()), false),
      due: due,
      urgency: urgency,
      complete: false
    };

    $http.post('/tasks', task)
      .then(function(success) {
        console.log('Task POST successful:', success);
        $scope.tasks.push(success.data);
      })
      .catch(function(err) {
        console.error('Task POST error:', err);
      });

    $scope.socket.emit('addTask', task);
  };

  $scope.toggle = function(task) {
    if (!task.complete) {
      task.complete = true;
      $http.put('/tasks/' + task._id + '/complete')
        .then(function(success) {
          console.log('Task PUT successful');
        })
        .catch(function(err) {
          console.error('Task PUT error:', err);
        });
    } else {
      task.complete = false;
      $http.put('/tasks/' + task._id + '/incomplete')
        .then(function(success) {
          console.log('Task PUT successful');
        })
        .catch(function(err) {
          console.error('Task PUT error:', err);
        });
    }
  };

  $scope.delete = function(task) {
    $scope.tasks.forEach(function(item, i) {
      if (item._id === task._id) {
        $scope.tasks.splice(i, 1);
      }
    });

    $http.delete('/tasks/' + task._id)
      .then(function(result) {
        console.log('Task DELETE successful');
      })
      .catch(function(err) {
        console.error('Task DELETE error:', err);
      });
  };


  // $scope.clear = function() {
  //   this.createTask.$setPristine();

  //   var ids = $scope.tasks.map(function(task) {
  //     if (task.complete) {
  //       return task._id;
  //     }
  //   });

  //   $http.delete('/tasks/' + ids)
  //     .then(function(result, err) {
  //       if (err) {
  //         console.error('Task DELETE error:', err);
  //         return;
  //       } else {
  //         console.log('Clear successful');
  //         $scope.tasks.forEach(function(task, i) {
  //           if (task.complete) {
  //             $scope.tasks.splice(i, 1);
  //           }
  //         });
  //       }
  //     });

  // };

})
.factory('Tasks', function($http) {

  var obj = {

    tasks: [],

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

    }

  };

  return obj;

});

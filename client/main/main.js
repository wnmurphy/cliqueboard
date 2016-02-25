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
  $scope.draw = function(x, y, type, color){
    //set color property
    if (type === "dragstart"){
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    }else if (type === "drag"){
      this.ctx.lineTo(x,y);
      this.ctx.stroke();
    }else{
      this.ctx.closePath();
    }
    return;
  };

  //Run init
  $scope.init();
  
  //Set up socket connection for incoming draw events
  $scope.socket = io.connect('http://localhost:4568');

  // Create draw event listener which triggers local draw event.
  $scope.socket.on('draw', function(data){
    this.draw(data.x, data.y, data.type, data.color); 
  });

  //Handle draw events
  $('canvas').live('drag dragstart dragend', function(e){
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

  // Clear the canvas
  $scope.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
})

//====================== Chat Controller ==================
.controller('chatController', function ($scope, logInUserInfo) {
  var userInfo = logInUserInfo.userData;

  $scope.socket = io.connect('http://localhost:4568');
  console.log('USERINFO ', userInfo);

  var userName = userInfo.map(function (user) {
    return user.username;
  });
    // on connection to server, ask for user's name with an anonymous callback
    $scope.socket.on('connect', function(){
      // call the server-side function 'adduser' and send one parameter (value of prompt)
      $scope.socket.emit('adduser', userName);
    // $scope.socket.emit('adduser', function(username){
    //   return username;
    // });
    });

    // listener, whenever the server emits 'updatechat', this updates the chat body
 
  $scope.socket.on('updateusers', function(data) {
      $('#users').empty();
    
      $.each(data, function(key, value) {
        console.log('key ', key);
        console.log('value ', value);
          $('#users').append('<div>' + value + '</div>');
    });
  });

   $scope.socket.on('updatechat', function (username, data) {
    console.log('data ', data)
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
    $(function(){
    // when the client clicks SEND
    $('#datasend').click( function() {
      var message = $('#data').val();
      $('#data').val('');
      // tell server to execute 'sendchat' and send along one parameter
      $scope.socket.emit('sendchat', message);
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
      if(e.which == 13) {
        $(this).blur();
        $('#datasend').focus().click();
      }
    });
  });
})


//====================== Tasks Controller ==================
.controller('tasksController', function ($scope, $http, Tasks) {
  angular.extend($scope, Tasks);

  $scope.addTask = function(name, due, urgency) {
    urgency = urgency || 'Not Urgent';
    // empty task and date input field after entry
    $scope.task = '';
    $scope.datetime = '';

    var task = {
      name: name,
      created: new Date(Date.now()),
      due: due,
      urgency: urgency,
      complete: false
    };

    $http.post('/tasks', task)
      .then(function(err, result) {
        if (err) {
          console.error('Task POST error:', err);
        }
      });

    $http.get('/tasks')
      .then(function(result) {
        console.log('Task GET successful');
        result.data.forEach(function(task) {
          task.due = $scope.formatDate(task.due, true);
          task.created = $scope.formatDate(task.created, false);
        });
        $scope.tasks = result.data;
      })
      .catch(function(err) {
        console.error('Task GET error:', err);
      });
    // $scope.tasks.push(task);
    // $scope.incomplete.push(task);
  };

})
.factory('Tasks', function() {

  var obj = {

    view: 'all',

    tasks: [],
    // completed: [],
    // incomplete: [],

    incompleteCheck: function() {
      obj.tasks.forEach(function(task) {
        obj.incomplete.forEach(function(incTask) {
          if (!task.complete && incTask.name !== task.name) {
            obj.incomplete.push(task);
          }
        });
      });
    },

    fetchTasks: function() {
      $http.get('/tasks')
        .then(function(result) {
          $scope.tasks = result.data
        })
        .catch(function(err) {
          console.error('Error fetching tasks:', err);
        });
    },

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



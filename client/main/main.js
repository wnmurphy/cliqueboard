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
    this.ctx.strokeStyle = color;  
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
  $scope.socket = io.connect('triceratest.heroku.com');

  // Create draw event listener which triggers local draw event.
  $scope.socket.on('draw', function(data){
    $scope.draw(data.x, data.y, data.type, data.color);
  });

  // Create clear event listener
  $scope.socket.on('clear', function(data){
    $scope.remoteClear();
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

  var socket = io.connect("triceratest.heroku.com");
  // var socket = io.connect(window.location.hostname);
  // $scope.socket = io.connect('http://localhost:4568');

 // Store username of the currently logged-in user
  var userName = $rootScope.loggedInUser;

    $scope.socket.on('connect', function(){
      
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
      .then(function(err, result) {
        if (err) {
          console.error('Task POST error:', err);
        }
      });

    $http.get('/tasks/all')
      .then(function(result) {
        console.log('Task GET successful');
        $scope.all = result.data;
        $scope.getList('incomplete');
      })
      .catch(function(err) {
        console.error('Task GET error:', err);
      });
  };

  $scope.getList = function(list, bool) {
    $http.get('/tasks/' + list)
      .then(function(result) {
        console.log(list + ' task GET successful:', result.data);
        if (list === 'completed') {
          $scope.completed = result.data;
        } else if (list === 'incomplete') {
          $scope.incomplete = result.data;
        }
      })
      .catch(function(err) {
        console.error('Incomplete task GET error:', err);
      });
  };

  $scope.deleteTask = function(task, bool) {
    if (bool) {
      $http.delete('/tasks/complete/' + task._id)
        .then(function(result) {
          console.log('Task DELETE successful');
          $scope.getList('completed');
        })
        .catch(function(err) {
          console.error('Task DELETE error:', err);
        });
    } else {
      $http.put('/tasks/incomplete/' + task._id)
        .then(function(result) {
          console.log('Successfully PUT task:', result);
          $scope.getList('incomplete', true);
          $scope.completed.push(task);
        })
        .catch(function(err) {
          console.error('Error PUT task:', err);
        });
    }
  };

})
.factory('Tasks', function($http) {

  var obj = {

    view: 'all',

    all: [],

    completed: [],

    incomplete: [],

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



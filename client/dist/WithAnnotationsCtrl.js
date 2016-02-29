// Declare app level module which depends on views, and components
angular.module('twork', [
  'ngRoute',
  'twork.login',
  'twork.signup',
  'twork.main',
  'ui.materialize'
])
.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
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
}])
.run(["$rootScope", "$location", function ($rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!$rootScope.loggedInUser && ($location.path() !== '/signup')) {
      $location.path('/login');
    }
  });
}]);

angular.module('twork.main', [])


//====================== Whiteboard Controller ==================
.controller('whiteboardController', ["$scope", function ($scope) {
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
}])

//====================== Chat Controller ==================
.controller('chatController', ["$scope", "$rootScope", function ($scope, $rootScope) {
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
}])


//====================== Tasks Controller ==================
.controller('tasksController', ["$scope", "$http", "Tasks", function ($scope, $http, Tasks) {
  angular.extend($scope, Tasks);

  $scope.socket = io();

  $scope.socket.on('add', function(task) {
    $scope.$apply(function() {
      $scope.tasks[task._id] = task;
      console.log('ADDED:', task);
    });
  });

  $scope.socket.on('delete', function(taskId) {
    $scope.$apply(function() {
      delete $scope.tasks[taskId];
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

    // empty input fields after submission and reset form to pristine
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

}])
.factory('Tasks', ["$http", function($http) {

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

      return date;
    }

  };

  return obj;

}]);

angular.module('twork.login', [])

.controller('loginController', ["$scope", "$rootScope", "logInUserInfo", function ($scope, $rootScope, logInUserInfo) {
  angular.extend($scope, logInUserInfo);
}])
.factory('logInUserInfo', ["$http", "$location", "$rootScope", function($http, $location, $rootScope) {

	var holdUserName;

  var requestUser = function(username, password) {
     holdUserName = username;

  var data = {
       username: username,
       password: password
       };

      return $http.post('/login', data)
       .then(function(res, status) {
         $rootScope.loggedInUser = holdUserName;
         $location.path('/');
       })
       .catch(function(err) {
         $location.path('/login');
       });
    };

  var logoutUser = function(){
    $rootScope.loggedInUser = undefined;
    $location.path('/login');
  };

	return {
		requestUser: requestUser,
		holdUserName: holdUserName,
    logoutUser: logoutUser,
	}
}]);

angular.module('twork.signup', [])

.controller('signupController', ["$scope", "signUpInfo", function ($scope, signUpInfo) {
  angular.extend($scope, signUpInfo);

}])
.factory('signUpInfo', ["$http", "$location", "$rootScope", function($http, $location, $rootScope) {

	var holdUserName;

  var createUser = function(email, username, password) {
     holdUserName = username;

      var data = {
         email: email,
         username: username,
         password: password
       };

       return $http.post('/signup', data)
         .then(function(resp, status) {
           $rootScope.loggedInUser = holdUserName
           $location.path('/');
         })
         .catch(function(err) {
           $location.path('/signup');
         });
      };




  return {
    createUser: createUser,
    holdUserName: holdUserName
  }
}]);

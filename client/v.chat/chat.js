angular.module('collaby.chat', [])

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
});

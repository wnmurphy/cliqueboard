var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var morgan = require('morgan');
var bodyParse = require('body-parser');
// var db = require("./config.js");
//bodyParse will be needed for chat later on
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());

var port = process.env.PORT || 4568;

//example interaction with mongo from server:
// when user enters new username and password
// encrypt password
// add to db.users

app.use(morgan('dev'));
app.use(express.static(__dirname + '/client'));

///// Add CORS headers to all traffic /////
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// handle POST requests
  
  // add new user
  app.post('/signup',
    function(req,res){
      var email = req.body.email;
      var username = req.body.username;
      var password = req.body.password;
      // check if user already exists in db
      
      // if not, add new user
    
    });
  
  // add new tasks
  // app.post();
  
  // add new room
  // app.post();
  
  // add new message
  // app.post();


// handle GET requests
  
  // get messages for room
  // app.get();

  // get tasks
  // app.get();

  // get username to check auth
  // app.get();







/////The below connection is for whiteboard/////

io.sockets.on('connection', function(socket) {
  console.log('connection running');
  socket.on('drawClick', function(data) {
     // console.log(data); //< --------- log draw events 
    socket.broadcast.emit('draw', {
      x: data.x,
      y: data.y,
      type: data.type,
      color:data.color
    });
  });
});



/////Connection below is for Multi user chatRoom/////

var usernames = {};

// rooms which are currently available in chat
//var rooms = ['room1','room2','room3'];
// io.sockets.on('connection', function(socket){
//     socket.on('subscribe', function(room) { 
//         console.log('joining room', room);
//         socket.join(room); 
//     })

//     socket.on('unsubscribe', function(room) {  
//         console.log('leaving room', room);
//         socket.leave(room); 
//     })

//     socket.on('send', function(data) {
//         console.log('sending message');
//         io.sockets.in(data.room).emit('message', data);
//     });
// });

io.sockets.on('connection', function (socket) {

  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username){
    // store the username in the socket session for this client
    socket.username = username;
    // store the room name in the socket session for this client

    ///////For adding someone to a room One Day////////////////
      socket.room = 'room1';
        //send client to room 1
          socket.join('room1');

    // add the client's username to the globl list
    usernames[username] = username;
    
    
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', 'you have connected');
    // echo to room 1 that a person has connected to their room
    socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
    socket.emit('updateusers', usernames);
  });

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  });


/////////////////For switching rooms One Day///////////////////////
  // socket.on('switchRoom', function(newroom){
  //  // leave the current room (stored in session)
  //  socket.leave(socket.room);
  //  // join new room, received as function parameter
  //  socket.join(newroom);
  //  socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
  //  // sent message to OLD room
  //  socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
  //  // update socket session room title
  //  socket.room = newroom;
  //  socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
  //  socket.emit('updateusers', rooms, newroom);
  // });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    socket.leave(socket.room);
  });
});




http.listen(port);
console.log('listening on ' + port);
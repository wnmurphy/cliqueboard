// Express
var express = require('express');
var app = express();

// MongoDB
var db = require("./config.js");

// Helpers
var util = require("./utility.js")

// Socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Middleware
var morgan = require('morgan');
var request = require('request');
var session = require('express-session');

// ================ Configure Server ================= //

var port = process.env.PORT || 4568;

app.use(morgan('dev'));
app.use(express.static(__dirname + './../client'));
app.use(express.cookieParser('get tworkin you tworkin tworker'));
app.use(express.bodyParser());
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000
  }
}));

// ================ POST requests start ============== //

  // add new user to database
app.post('/signup', function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  // check if user already exists in db
  
  // if not, add new user
  var user = new db.User({
    username: username, 
    email: email, 
    password: password
  })
  .save()
    .then(function(user){
      console.log('Saved user: ', user);
      util.loginUser(user, req, res); //<-----util
    })
    .catch(function(err) {
      res.send(500, 'Error saving user, or user already in db.');
    });
});
  
// check user's credentials
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.User.findOne({ username: username })
    .exec(function(err, user) {
      if (!user) {
        res.send(500, 'User not found in db.');
      } else {
        var savedPassword = user.password;
        db.User.comparePassword(password, savedPassword, function(err, isMatch) {
          if (err) {
            console.error(err);
          }
          if (isMatch) {
            return util.loginUser(user, req, res);
          } else {
            res.send(500, 'Incorrect password for user.');
          }
        });
      }
    });
});

app.post('/tasks', function(req, res) {
  var task = new db.Task(req.body)
  .save()
    .then(function(task) {
      console.log('Added task:', task.name);
    })
    .catch(function(err) {
      console.error('Error adding task:', err);
    });
});

// ================ POST requests end ============== //


// ================ GET requests start ============== //

app.get('/tasks', function(req, res) {
  db.Task.find({})
    .exec(function(err, tasks) {
      if (err) {
        console.error('Error fetching tasks:', err);
        return;
      } else {
        res.json(tasks);
      }
    });
});

  // get messages for room
  // app.get();

  // get tasks
  // app.get();

// ================ GET requests end ============== // 


// ================ SOCKETS start ============== // 

io.sockets.on('connection', function(socket) {

//////////////////// Tasks Socket /////////////////////

  // socket.on('addTask', function(task) {

  // });

//////////////////// Whiteboard Socket /////////////////////

  socket.on('drawClick', function(data) {
     // console.log(data); //< --------- log draw events 
    socket.broadcast.emit('draw', {
      x: data.x,
      y: data.y,
      type: data.type,
      color:data.color
    });
  });

/////////////////////// Chat Socket ///////////////////////
  var usernames = {};

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

// ================ SOCKETS end ============== // 



// ================ Multi Chat Rooms start ============== // 

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
 
// ================ Multi Chat Rooms end ============== // 



// ================ Switch Chat Rooms start ============== // 

//   // socket.on('switchRoom', function(newroom){
//   //  // leave the current room (stored in session)
//   //  socket.leave(socket.room);
//   //  // join new room, received as function parameter
//   //  socket.join(newroom);
//   //  socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
//   //  // sent message to OLD room
//   //  socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
//   //  // update socket session room title
//   //  socket.room = newroom;
//   //  socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
//   //  socket.emit('updateusers', rooms, newroom);
//   // });

//   // when the user disconnects.. perform this
//   socket.on('disconnect', function(){
//     // remove the username from global usernames list
//     delete usernames[socket.username];
//     // update list of users in chat, client-side
//     io.sockets.emit('updateusers', usernames);
//     // echo globally that this client has left
//     socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
//     socket.leave(socket.room);
//   });
// });

// ================ Switch Chat Rooms end ============== // 

http.listen(port);
console.log('listening on ' + port);
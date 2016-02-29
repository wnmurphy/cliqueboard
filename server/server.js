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

// ================ Add CORS headers ============== //

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Access-Token, X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// ================ POST requests start ============== //

  // Create a new user and add him or her to database.
app.post('/signup', function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  // Build a new user object
  var user = new db.User({
    username: username,
    email: email,
    password: password
  })
  .save()
    .then(function(user){
      util.loginUser(user, req, res);
    })
    .catch(function(err) {
      res.send(400, 'Error saving user, or user already in db.');
    });
});

// Check user's credentials for login.
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.User.findOne({ username: username })
    .exec(function(err, user) {
      if (!user) {
        res.send(404, 'User not found in db.');
      } else {
        var savedPassword = user.password;
        db.User.comparePassword(password, savedPassword, function(err, isMatch) {
          if (err) {
            console.error(err);
          }
          if (isMatch) {
            return util.loginUser(user, req, res);
          } else {
            res.send(401, 'Incorrect password for user.');
          }
        });
      }
    });
});

// Create a new task.
app.post('/tasks', function(req, res) {
  new db.Task(req.body)
    .save()
      .then(function(task) {
        res.json(task);
      })
      .catch(function(err) {
        console.error('Error adding task:', err);
      });
});

app.post('/chat', function(req, res) {
  db.User.findByIdAndUpdate(req.session.user._id, { $push: { "messages": req.body } })
    .exec(function(err, success) {
      if (err) {
        console.error('Error saving message:', err);
        return;
      } else {
        res.json(success);
      }
    });
});

// ================ POST requests end ============== //


// ================ GET requests start ============== //

// Retrieve current tasks.
app.get('/tasks', function(req, res) {
  db.Task.find({})
    .exec(function(err, success) {
      if (err) {
        console.error('Error getting tasks:', err);
        return;
      } else {
        res.json(success);
      }
    });
});



// ================ DELETE requests start ============== //

//Remove a task from the database.
app.delete('/tasks/:id', function(req, res, next) {
  var id = req.params.id;
  // console.log('ID:', id);
  db.Task.remove({ _id: id })
    .exec(function(err, success) {
      if (err) {
        console.error('Error deleting task:', err);
        return;
      } else {
        res.json(success);
      }
    });
});



// ================ PUT requests start ============== //

// Toggle a task's status as complete/incomplete.
app.put('/tasks/:id/:status', function(req, res, next) {
  var id = req.params.id;
  var status = req.params.status;
  if (status === 'complete') {
    db.Task.findByIdAndUpdate(id, { $set: { complete: true } })
      .exec(function(err, success) {
        if (err) {
          console.error('Error updating task:', err);
          return;
        } else {
          res.json(success);
        }
      });
  } else if (status === 'incomplete') {
    db.Task.findByIdAndUpdate(id, { $set: { complete: false } })
      .exec(function(err, success) {
        if (err) {
          console.error('Error updating task:', err);
          return;
        } else {
          res.json(success);
        }
      });
  }
});



// ================ SOCKETS start ============== //
// Defines a socket connection
// Creates listeners for shared Task, Whiteboard, and Chat events.


io.sockets.on('connection', function(socket) {

// ================ Tasks socket ============== //

  socket.on('addTask', function(task) {
    socket.broadcast.emit('add', task);
  });

  socket.on('deleteTask', function(taskId) {
    socket.broadcast.emit('delete', taskId);
  });

  socket.on('toggleTask', function(taskId, status) {
    socket.broadcast.emit('toggle', taskId, status);
  });

// ================ Whiteboard socket ============== //

  socket.on('drawClick', function(data) {
    socket.broadcast.emit('draw', {
      x: data.x,
      y: data.y,
      type: data.type,
      color:data.color
    });
  });

  socket.on('clear', function(data){
    socket.broadcast.emit('clear');
  });


// ================ Chat socket ============== //
  var usernames = {};
  var rooms = ['room1','room2','room3'];
    // when the client emits 'adduser', this listens and executes
  	socket.on('adduser', function(username){
  		// store the username in the socket session for this client
  		socket.username = username;
  		// store the room name in the socket session for this client
  		socket.room = 'room1';
  		// add the client's username to the global list
  		usernames[username] = username;
  		// send client to room 1
  		socket.join('room1');
  		// echo to client they've connected
  		socket.emit('updatechat', 'SERVER', 'you have connected to ' + socket.room);
  		// echo to room 1 that a person has connected to their room
  		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
  		socket.emit('updaterooms', rooms, 'room1');
      io.sockets.emit('updateusers', usernames)
  	});

  	// when the client emits 'sendchat', this listens and executes
  	socket.on('sendchat', function (data) {
  		// we tell the client to execute 'updatechat' with 2 parameters
  		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  	});

  	socket.on('switchRoom', function(newroom){
      console.log('switchRoom listener in server reached');
  		// leave the current room (stored in session)
  		socket.leave(socket.room);
  		// join new room, received as function parameter
  		socket.join(newroom);
  		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
  		// sent message to OLD room
  		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
  		// update socket session room title
  		socket.room = newroom;
  		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
  		socket.emit('updaterooms', rooms, newroom);
  	});

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



// ================ Switch Chat Rooms start ============== //

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


http.listen(port);
console.log('listening on ' + port);

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var morgan = require('morgan');
var bodyParse = require('body-parser');


var port = process.env.PORT || 4568;


app.use(morgan('dev'));
app.use(express.static(__dirname + '/client'));


// var io;

// io = require('socket.io').listen(4000);



io.sockets.on('connection', function(socket) {
  console.log('connection running');
  socket.on('drawClick', function(data) {
    console.log(data);
    socket.broadcast.emit('draw', {
      x: data.x,
      y: data.y,
      type: data.type
    });
  });
});

//bodyParse will be needed for chat later on
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());


http.listen(port);
console.log('listening on ' + port);
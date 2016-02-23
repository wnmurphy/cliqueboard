var mongoose = require('mongoose');

var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/twork';

mongoose.connect(mongoURI, function(err, res) {
  if (err) {
    console.error('Error on Mongo connect:', err);
    return;
  } else {
    console.log('Successfully connected to db');
  }
});

mongoose.connection.once('open', function() {
  console.log('MongoDB Connection Open');
});

///////////////////////////////////////////////////////////////

var userSchema = mongoose.connection.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

exports.User = mongoose.connection.model('User', userSchema);

///////////////////////////////////////////////////////////////

var taskSchema = mongoose.connection.Schema({
  name: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  due: {
    type: Date,
    required: true
  },
  complete: {
    type: Boolean,
    required: true
  }
});

exports.Task = mongoose.connection.model('Task', taskSchema);

///////////////////////////////////////////////////////////////

var roomSchema = mongoose.connection.Schema({
  roomname: {
    type: String,
    required: true
  },
  messages: {
    type: Array,
    required: true
  }
});

exports.Room = mongoose.connection.model('Room', roomSchema);
var mongoose = require('mongoose');

var mongoURI = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/twork';

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

var userSchema = mongoose.Schema({
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

exports.User = mongoose.model('User', userSchema);

///////////////////////////////////////////////////////////////

var taskSchema = mongoose.Schema({
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

exports.Task = mongoose.model('Task', taskSchema);

///////////////////////////////////////////////////////////////

var roomSchema = mongoose.Schema({
  roomname: {
    type: String,
    required: true
  },
  messages: {
    type: Array,
    required: true
  }
});

exports.Room = mongoose.model('Room', roomSchema);
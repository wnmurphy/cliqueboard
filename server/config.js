var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var bluebird = require('bluebird');

// Create connection
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/twork';

mongoose.connect(mongoURI, function(err, res) {
  if (err) {
    console.error('Error on Mongo connect:', err);
    return;
  } else {
    console.log('Successfully connected to db');
  }
});

mongoose.connection.once('open', function() { //<--- may need to export the connection
  console.log('MongoDB Connection Open');
});


// ================ Create and export User model ==============
var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
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

var User = mongoose.model('User', userSchema);

User.comparePassword = function(candidatePassword, savedPassword, callback) {
  bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

userSchema.pre('save', function(next){
  var cipher = bluebird.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash){
      this.password = hash;
      next();
    });
});

module.exports.User = User;


// ================ Create and export Task model ==============

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
  urgency: {
    type: Number
  },
  complete: {
    type: Boolean,
    required: true
  }
});

var Task = mongoose.model('Task', taskSchema)

module.exports.Task = Task;


// ================ Create and export Room model ==============

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

var Room = mongoose.model('Room', roomSchema);

module.exports.Room = Room;
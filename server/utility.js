var request = require('request');

// Create a session with current user:
exports.loginUser = function (newUser, req, res) {
   return req.session.regenerate(function(){
    req.session.user = newUser;
    res.send(200, 'User logged in.');
  });
};
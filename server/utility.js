var request = require('request');

exports.loginUser = function(newUser, req, res) {
   return req.session.regenerate(function(){
    req.session.user = newUser;
    res.send(200, 'User logged in.');
  });
};

exports.isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

// use on any route change to verify authentication
exports.checkUser = function(req, res, next) {
  if (!exports.isLoggedIn(req)) {
    res.send(500, 'User not logged in.');
  } else {
    next();
  }
};
        

       
// app.post('/signin', userController.signin);


// exports.createSession = function(req, res, newUser) {
//   return req.session.regenerate(function() {
//       req.session.user = newUser;
//       console.log('redirect createSession');
//       res.redirect('/');
//     });
//};
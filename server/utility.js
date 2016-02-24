var request = require('request');

exports.loginUser = function(newUser, req, res) {
   return req.session.regenerate(function(){
    req.session.user = newUser;
    // res.redirect('/#/tasks');
  });
};

exports.isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

// use on any route change to verify authentication
exports.checkUser = function(req, res, next) {
  if (!exports.isLoggedIn(req)) {
    console.log('redirect checkUser');
    res.redirect('/login');
  } else {
    next();
  }
};

// signin: function (req, res, next) {
//     var username = req.body.username,
//         password = req.body.password;

//     var findUser = Q.nbind(User.findOne, User);
//     findUser({username: username})
//       .then(function (user) {
//         if (!user) {
//           next(new Error('User does not exist'));
//         } else {
//           return user.comparePasswords(password)
//             .then(function(foundUser) {
//               if (foundUser) {
//                 var token = jwt.encode(user, 'secret');
//                 res.json({token: token});
//               } else {
//                 return next(new Error('No user'));
//               }
//             });
//         }
//       })
//       .fail(function (error) {
//         next(error);
//       });
//   },              

       
// app.post('/signin', userController.signin);


// exports.createSession = function(req, res, newUser) {
//   return req.session.regenerate(function() {
//       req.session.user = newUser;
//       console.log('redirect createSession');
//       res.redirect('/');
//     });
//};
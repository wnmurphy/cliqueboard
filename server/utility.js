exports.loginUser = function(user, req, res) {
  req.session.regenerate(function() {
    req.session.user = user.get('username');
    res.redirect('/');
  });
};

exports.isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
  if (!exports.isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};
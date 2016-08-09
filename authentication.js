var User = require("./models/User");
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(
	{ passReqToCallback : true },
	function(req, username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, req.flash('message', 'User Not found') );
			}
			if (password !== user.password /*!user.validPassword(password)*/) {
				return done(null, false, req.flash('message', 'Invalid Password') );
			}
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

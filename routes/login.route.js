'use strict';
var Users = require('../models/user.model');
var express = require('express');
var jwt = require('jwt-simple');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

// const myPlaintextPassword = 'click123';
// const someOtherPlaintextPassword = 'not_bacon';

passport.use(new LocalStrategy({
		usernameField:'name',
		passwordField: 'password'
	},
	function(name, password, done) {
		Users.findOne({ name: name }, function (err, user) {

			if (err) return done(err);
			if (!user) return done(null, false, { message: 'Incorrect User Details.' });
			if (!validPassword(user.password, password)) return done(null, false, { message: 'Incorrect User Details.' });
			return done(null, user);
			
		});
	}
));

router.route('/login').post(function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {

		if (err) return next(err);
		if (!user) return res.status(401).json({error: info.message});

		req.logIn(user, function(err) {
			console.log(user,'login 2');

			if (err) return next(err);
			var token = jwt.encode(user._id, 'hello');
			console.log(token,'the users token');
			return res.json({token : token, user: user});

		});
	})(req, res);
});

function validPassword(dbPassword, password){
	return bcrypt.compareSync(password, dbPassword);
}

module.exports = router;


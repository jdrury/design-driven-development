'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
	res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
	res.render('users/signin', {
		showBackground: true,
		title: 'Signin',
		message: req.flash('error')
	});
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
	res.render('users/signup', {
		showBackground: true,
		title: 'Sign up',
		user: new User()
	});
};

/**
 * Logout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
	res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
	var user = new User(req.body);
	var message = null;

	user.provider = 'local';
	user.save(function(err) {
		if (err) {
			switch (err.code) {
				case 11000:
				case 11001:
					message = 'Username already exists';
					break;
				default:
					message = 'Please fill all the required fields';
			}
			return res.render('users/signup', {
				message: message,
				user: user
			});
		}
		req.logIn(user, function(err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	User.find().populate('projects', 'title').exec(function(err, user) {
		res.jsonp(user || null);
	});
};

// NOTE: list of users may be doing the same thing as send user right now

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
	User.load(id, function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load user ' + id));
		req.user = user;
		next();
	});
};

/**
 * Show a user
 */
exports.show = function(req, res) {
	res.jsonp(req.user);
};

/**
 * List of Users
 */
exports.all = function(req, res) {
	User.find().populate('projects', 'title').exec(function(err, users) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(users);
		}
	});
};
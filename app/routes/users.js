'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function(app, passport) {

	app.get('/signin', users.signin);
	app.get('/signup', users.signup);
	app.get('/signout', users.signout);

	// NOTE: users/me and users seem to be doing the same thing right now
	app.get('/users/me', users.me);
	app.get('/users', users.all);
	app.get('/users/:userId', users.show);

	// Setting up the users api
	app.post('/users', users.create);

	// Setting up the userId param
	app.param('userId', users.user);

	// Setting the local strategy route
	app.post('/users/session', passport.authenticate('local', {
		failureRedirect: '/signin',
		failureFlash: true
	}), users.session);

	// Setting the github oauth routes
	app.get('/auth/github', passport.authenticate('github', {
		failureRedirect: '/signin'
	}), users.signin);

	app.get('/auth/github/callback', passport.authenticate('github', {
		failureRedirect: '/signin'
	}), users.authCallback);

};

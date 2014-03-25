'use strict';

module.exports = {
	db: 'mongodb://localhost/finalproject-dev',
	app: {
		name: 'Working Title'
	},
	facebook: {
		clientID: '1409189336005712',
		clientSecret: 'ac9a4401257ce2cd2f0d09ecd429d592',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: 'ZGWED1alGOr29ouhzIuesg',
		clientSecret: 'mTUdpqlwzHFFO1jelcuyTR1RaZ07nlX7C89lWx3Vleo',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	github: {
		clientID: '67a901efc7bf145c7b66',
		clientSecret: 'cd4d7f4c8de133df97d5b112553c31378758488b',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	},
	google: {
		clientID: '72368565161.apps.googleusercontent.com',
		clientSecret: 'qyNr2gK_zS49zdG5ArYj8Myt',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: '775yte5qtyc417',
		clientSecret: 'BC7qO6u7ZyztQkxS',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	}
};

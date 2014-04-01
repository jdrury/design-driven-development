'use strict';

module.exports = {
	db: process.env.MONGOLAB_URI,
	app: {
		name: 'Design Driven Development Tool'
	},
	github: {
    clientID: '0ac83f6b151c2da78fdc',
    clientSecret: '72563dc41779974b6ae776f8c4a0eb25a5ebde70',
    callbackURL: 'http://designdriven.fullstackacademy.com/auth/github/callback'
  }
};

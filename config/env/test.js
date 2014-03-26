'use strict';

module.exports = {
	db: 'mongodb://localhost/3DT-test',
	port: 3001,
	app: {
		name: 'Design Driven Development Tool'
	},
	github: {
		clientID: '0ac83f6b151c2da78fdc',
		clientSecret: '72563dc41779974b6ae776f8c4a0eb25a5ebde70',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	}
};
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('SMTP', {
	host: 'smtp.laurenashpole.com',
	secureConnection: true,
	port: 465,
	auth: {
		user: 'finalproject@laurenashpole.com',
		pass: 'FinalProject1595'
	}
});

module.exports = smtpTransport;

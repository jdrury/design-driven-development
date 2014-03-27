'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Project = mongoose.model('Project'),
	User = mongoose.model('User'),
	Version = mongoose.model('Version'),
	Note = mongoose.model('Note'),
	_ = require('lodash');
var smtpTransport = require('./nodemailer');
var nodemailer = require('nodemailer');
var AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/aws.json');

/**
 * Find project by id
 */
exports.project = function(req, res, next, id) {
	Project.load(id, function(err, project) {
		if (err) return next(err);
		if (!project) return next(new Error('Failed to load project ' + id));
		req.project = project;
		next();
	});
};

/**
 * Create a project
 */
exports.create = function(req, res) {
	var project = new Project(req.body);

	// add user to project
	var user = req.user;
	project.users.push(user);
	// add collaborator to project
	if(req.body.userToAdd){
		project.users.push(req.body.userToAdd);
	}
	// add project to user
	user.projects.push(project._id);
	user.save();
	// add project to collaborator
	User.update({ _id: req.body.userToAdd }, { $push: { projects: project._id }}, function(err, data) {
	});
	// email collaborator
	if(req.body.userToAdd){
	User.findOne({ _id: req.body.userToAdd }, function(err, foundUser) {
		var email = foundUser.email;
		var mailOptions = {
			from: 'Lauren Ashpole <finalproject@laurenashpole.com.com>',
			to: email,
			subject: req.user.name + ' added you to a project on 3DT!',
			text: 'Hey ' + foundUser.name + '! ' + req.user.name + ' has added you to the project ' + req.body.title + ' on 3DT.',
			html: '<p>Hey ' + foundUser.name + '!</p><p>' + req.user.name + ' has added you to the project ' + req.body.title + ' on 3DT.</p>'
		};


		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
			} else {
				console.log('Message sent: ' + response.message);
			}
		});

	});
}

	// save project
	project.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors: err.errors,
				project: project
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * Invite a user
 */

exports.invite = function(req, res) {
	var inviteEmail = req.body.inviteEmail;
	var mailOptions = {
		from: 'Lauren Ashpole <finalproject@laurenashpole.com.com>',
		to: inviteEmail,
		subject: req.user.name + ' invited you to sign up for 3DT!',
		text: 'Hey! ' + req.user.name + ' would like you to signup for 3DT so you can discuss a project.',
		html: '<p>Hey!</p><p>' + req.user.name + ' would like you to signup for 3DT so you can discuss a project.</p>'
	};

	smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
		} else {
			console.log('Message sent: ' + response.message);
			res.redirect('#!/projects/create');
		}
	});
};

/**
 * Update a project
 */
exports.update = function(req, res) {
	var project = req.project;

	project = _.extend(project, req.body);

	project.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors: err.errors,
				project: project
			});
		} else {
        console.log(project);
			res.jsonp(project);
		}
	});
};

/**
 * Delete a project
 */
exports.destroy = function(req, res) {
	var project = req.project;

	project.remove(function(err) {
		Version.find({ project: req.project._id }, function(err, versions) {
			versions.forEach(function(version) {

				var s3 = new AWS.S3();
				s3.client.deleteObject({Bucket: 'laurenashpolefp', Key: version.file }, function(err, data) {
					console.log(err, data);
				});
				version.remove();

				Note.find({ version: version._id }, function(err, notes) {
					notes.forEach(function(note) {
						note.remove();
					});
				});
			});
		});
		if (err) {
			return res.send('users/signup', {
				errors: err.errors,
				project: project
			});
		} else {
			res.jsonp(project);
		}
	});

};

/**
 * Show a project
 */
exports.show = function(req, res) {
	res.jsonp(req.project);
};

/**
 * List of Projects
 */
exports.all = function(req, res) {
	Project.find().sort('-created').populate('users', 'name username email').exec(function(err, projects) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(projects);
		}
	});
};

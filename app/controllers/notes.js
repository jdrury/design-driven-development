'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Note = mongoose.model('Note'),
	Project = mongoose.model('Project'),
	_ = require('lodash');
var smtpTransport = require('./nodemailer');
var nodemailer = require('nodemailer');

/**
 * Find note by id
 */
exports.note = function(req, res, next, id) {
	Note.load(id, function(err, note) {
		if (err) return next(err);
		if (!note) return next(new Error('Failed to load note ' + id));
		req.note = note;
		next();
	});
};

/**
 * Create a note
 */
exports.create = function(req, res) {
	var note = new Note({content: req.body.content});
	note.version = req.params.versionId;
	note.user = req.user;
	note.coordinates.push(req.body.xcoord);
	note.coordinates.push(req.body.ycoord);

	note.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors: err.errors,
				note: note
			});
		} else {
			res.jsonp(note);
		}
	});
};

/**
 * Notify collaborator
 */

exports.notify = function(req, res) {
	Project.findOne({ _id: req.params.projectId }).populate('users', 'name email').exec(function(err, project) {
		project.users.forEach(function(user) {
			if (user._id !== req.user._id) {
				var mailOptions = {
					from: 'Lauren Ashpole <finalproject@laurenashpole.com.com>',
					to: user.email,
					subject: req.user.name + ' left you notes on 3DT!',
					text: 'Hey ' + user.name + '! ' + req.user.name + ' left you notes on ' + project.title + '.',
					html: '<p>Hey ' + user.name + '!</p><p>' + req.user.name + ' left you notes on ' + project.title + '.</p>'
				};

				smtpTransport.sendMail(mailOptions, function(error, response){
					if(error){
						console.log(error);
					} else {
						console.log('Message sent: ' + response.message);
					}
				});
			}
		});
	});
	res.redirect('#!/projects/' + req.params.projectId + '/versions/' + req.params.versionId);
};

/**
 * Update a note
 */
exports.update = function(req, res) {
	var note = req.note;

	note = _.extend(note, req.body);

	note.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors: err.errors,
				note: note
			});
		} else {
			res.jsonp(note);
		}
	});
};

/**
 * Delete a note
 */
exports.destroy = function(req, res) {
	var note = req.note;

	note.remove(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors: err.errors,
				note: note
			});
		} else {
			res.jsonp(note);
		}
	});
};

/**
 * Show a note
 */
exports.show = function(req, res) {
	res.jsonp(req.note);
};

/**
 * List of notes
 */
exports.all = function(req, res) {
	Note.find().populate('version').populate('user', 'name username').exec(function(err, notes) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(notes);
		}
	});
};

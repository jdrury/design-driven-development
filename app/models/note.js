'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Note Schema
 */
var NoteSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	coordinates: [],
	content: {
		type: String,
		default: '',
		trim: true
	},
	version: {
		type: Schema.ObjectId,
		ref: 'Version'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

/**
 * Validations
 */


/**
 * Statics
 */
NoteSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate('version').populate('users', 'name username').exec(cb);
};

mongoose.model('Note', NoteSchema);

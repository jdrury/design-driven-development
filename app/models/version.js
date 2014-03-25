'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Version Schema
 */
var VersionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  screenShot: String,
  mockup: String,
  compared: String,
  percentage: Number,
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  }
});
/**
 * Statics
 */
VersionSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate('project').exec(cb);
};

mongoose.model('Version', VersionSchema);

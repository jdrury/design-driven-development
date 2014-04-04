'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Version = mongoose.model('Version'),
 Project = mongoose.model('Project'),
 Note = mongoose.model('Note'),
 _ = require('lodash');
 var fs = require('fs');
 var AWS = require('aws-sdk');
 AWS.config.loadFromPath(__dirname + '/aws.json');

 var pngparse = require('pngparse');

 var PNG = require('pngjs').PNG;

 var webshot = require('webshot');
 var request = require('request');
 var os = require('os');
 var ostemp = os.tmpdir() + '/';

 var kue = require('kue')
 , jobs = kue.createQueue();


/**
 * Find version by id
 */
 exports.version = function(req, res, next, id) {
 	Version.load(id, function(err, version) {
 		if (err) return next(err);
 		if (!version) return next(new Error('Failed to load version ' + id));
 		req.version = version;
 		next();
 	});
 };

/**
 * Create a version
 */
 exports.create = function(req, res) {
 	console.log(ostemp)
 	var version = new Version();

 	version.project = req.params.projectId;

 	var file = req.files.mockup;
 	var filePath = file.path;

 	var url = req.body.screenShot.replace(/\s/g, '');

  // temporary id number generator
  console.log(version._id);
  var fileId = version._id;
  console.log(fileId);
  // set screenshot file name
  var screenshotName = fileId + '-ss.png';

  // change user file name to test id
  var fileRename = file.name.split('.');
  fileRename[0] = fileId;
  file.name = fileRename.join('.');

  var linkUrl = 'http://s3.amazonaws.com/screenshotsfp/' + screenshotName;
  var fileUrl = 'http://s3.amazonaws.com/screenshotsfp/' + file.name;

  version.mockup = fileUrl;
  version.screenShot = linkUrl;

  version.save(function(err){
  	if(err) {
  		return console.log(err);
  	}


  	fs.createReadStream(filePath)
  	.pipe(new PNG({
  		filterType: 4
  	}))
  	.on('parsed', function() {
  		var heightToUse = this.height;
  		var widthToUse = this.width;

  // upload user file to s3
  fs.readFile(filePath, function(err, data) {
  	if (err) { throw err; }
  	var s3 = new AWS.S3({ params: {Bucket: 'screenshotsfp', Key: file.name} });
  	s3.putObject({
  		Body: data
  	}, function() {
  		console.log('uploaded mockup: ' + file.name);

  		var options = {
  			screenSize: {
  				width: widthToUse,
  				height: heightToUse
  			},
  			shotSize: {
  				width: widthToUse,
  				height: heightToUse
  			},
  			windowSize: {
  				width: widthToUse,
  				height: heightToUse
  			},
  			script: function() {
  				setTimeout(function() {
  					window.callPhantom('takeShot');
  				},2000);
  			},
  			takeShotOnCallback: true
  		};

      // upload screenshot to s3
      webshot(url, ostemp + screenshotName, options, function(err) {
      	console.log(err);
      	fs.readFile(ostemp + screenshotName, options, function(err, data) {
      		if (err) { throw err; }
      		var s3 = new AWS.S3({ params: {Bucket: 'screenshotsfp', Key: screenshotName} });
      		s3.putObject({
      			Body: data
      		}, function() {
      			console.log('uploaded screenshot: ' + screenshotName);
      			var job = jobs.create('compare',{args: [linkUrl, fileUrl, fileId]}).save();
      			job.on('complete', function() {
      				console.log("completed job");
      				Version.findOne({_id:fileId}, function(err, version){
      					res.jsonp(version);
      				})
      			});
      		});
      	});
      });

    });
});

});

});
};



/**
 * Delete an version
 */
 exports.destroy = function(req, res) {
 	var version = req.version;

 	var screenshotName = version.screenShot.split('/');
 	var mockupName = version.mockup.split('/');
 	var comparedName = version.compared.split('/');

 	var s3 = new AWS.S3();
 	s3.client.deleteObject({Bucket: 'screenshotsfp', Key: screenshotName[screenshotName.length-1] }, function(err, data) {
 		console.log(err, data);
 		s3.client.deleteObject({Bucket: 'screenshotsfp', Key: mockupName[mockupName.length-1] }, function(err, data) {
 			console.log(err, data);
 			s3.client.deleteObject({Bucket: 'screenshotsfp', Key: comparedName[comparedName.length-1] }, function(err, data) {
 				console.log(err, data);
 			});
 		});
 	});

 	version.remove(function(err) {
 		Note.find({ version: req.version._id }, function(err, notes) {
 			notes.forEach(function(note) {
 				note.remove();
 			});
 		});
 		if (err) {
 			return res.send('users/signup', {
 				errors: err.errors,
 				version: version
 			});
 		} else {
 			res.jsonp(version);
 		}
 	});
 };

/**
 * Show a version
 */
 exports.show = function(req, res) {
 	res.jsonp(req.version);
 };

/**
 * List of versions
 */
 exports.all = function(req, res) {
 	Version.find().populate('project').exec(function(err, versions) {
 		if (err) {
 			res.render('error', {
 				status: 500
 			});
 		} else {
 			res.jsonp(versions);
 		}
 	});
 };

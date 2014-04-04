var kue = require('kue')
  , jobs = kue.createQueue();


var fs = require('fs');

// Initializing system variables
var config = require('../config/config'),
    mongoose = require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(config.db);


// Bootstrap models
var models_path = __dirname + '/../app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

var Version = mongoose.model('Version'),
	Project = mongoose.model('Project'),
	Note = mongoose.model('Note'),
	_ = require('lodash');
var AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/../app/controllers/aws.json');

var pngparse = require('pngparse');

var PNG = require('pngjs').PNG;

var webshot = require('webshot');
var request = require('request');
var os = require('os');
var ostemp = os.tmpdir() + '/';


jobs.process('compare', function(job, done){
	runTests.apply(null, job.data.args.concat(done));
});


var runTests = function(linkURL, fileURL, fileId, done){
	console.log("test running");
	console.log(fileId);
	Version.findOne({_id: fileId}, function(err, version) {
		console.log('file found', err, version);
		console.log(version);
	  request.get({url: fileURL, encoding: 'binary'}, function(err, response, body){
	    fs.writeFile(ostemp+'image.png', body, 'binary', function(err){
	      fs.createReadStream(ostemp +'image.png')
	      .pipe(new PNG({
	          filterType: 4
	      }))
	      .on('parsed', function() {
	        var data1 = this;
	        request.get({url: linkURL, encoding: 'binary'}, function(err, response, body){
	          fs.writeFile(ostemp +'image2.png', body, 'binary', function(err){
	          fs.createReadStream(ostemp+'image2.png')
	          .pipe(new PNG({
	            filterType: 4
	           }))
	          .on('parsed', function() {
	            var data2 = this;
	            var totalPixels = data1.height * data1.width;
	            console.log("mockup specs: " + data1.width + "w, " + data1.height + "h");

	            var differenceCount = 0;
	            for (var y = 0; y < data1.height; y++) {
	                for (var x = 0; x < data1.width; x++) {
	                    var idx = (data1.width * y + x) << 2;
	                    if((data1.data[idx] !== data2.data[idx] || data1.data[idx+1] !== data2.data[idx+1] || data1.data[idx+2] !== data2.data[idx+2])){
	                        differenceCount++;
	                        data2.data[idx] =  data2.data[idx] + 255;
	                        data2.data[idx+1] = 255 - data2.data[idx+1];
	                        data2.data[idx+2] = 255 - data2.data[idx+2];
	                    }
	                }
	            }
	            console.log("These pictures are " + ((1 - (differenceCount/totalPixels)) *100) + "% similar.");

	            var r = this.pack().pipe(fs.createWriteStream(ostemp+'out.png'));

	            r.on('close', function(){
	                fs.readFile(ostemp+'out.png', function(err, data) {
	                if (err) { throw err; }
	                var s3 = new AWS.S3({ params: {Bucket: 'screenshotsfp', Key: fileId+'-out.png' }});
	                s3.putObject({
	                  Body: data
	                }, function() {
	                  console.log('uploaded comparison: ' + fileId + 'out.png');

	              var percentage = ((1 - (differenceCount/totalPixels)) *100);
	              version.percentage = percentage;
	              version.compared = 'http://s3.amazonaws.com/screenshotsfp/'+ fileId +'-out.png';
	                // save version
	                version.save(function(err) {
	                  if (err) {
	                  	done(err);
	                    // return res.send('users/signup', {
	                    //   errors: err.errors,
	                    //   version: version
	                    // });
	                  } else {
	                    // res.jsonp(version);
	                    done();
	                  }
	                });

	                  });
	              });
	            })


	            });
	          });
	        });
	      });
	    })
	  })
	});
}
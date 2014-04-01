var page = require('webpage').create();
page.open('http://nytimes.com/', function() {
  page.render('github.png');
  phantom.exit();
});

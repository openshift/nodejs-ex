//Dependencies
var express = require('express'),
	webapp = express(),
	Promise = require('promise');

//OpenShift Settings
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || 'localhost',
	port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//External Routing
webapp.get('/', function (req, res, next) {
  
  var options = {};

  res.sendFile(__dirname + '/public/views/pages/index.html', options, function (err) {
    if (err) {
      next(err);
    } else {
      return;
    }
  });

});

webapp.use('/public', express.static(__dirname + '/public'));

//Webapp Initialize
webapp.listen(3000, function () {
	console.log('started');
});
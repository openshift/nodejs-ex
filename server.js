//Dependencies
var express = require('express'),
	webapp = express(),
	Promise = require('promise'),
  morgan  = require('morgan');

//OpenShift Settings
var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost',
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//Reporting
app.use(morgan('combined'));

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
app.listen(port, ip);
console.log('working');

module.exports = webapp;
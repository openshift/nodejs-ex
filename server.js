//Dependencies
var express = require('express');
var	webapp = express();
var	Promise = require('promise');
//var  morgan  = require('morgan');

//OpenShift Settings
var ip = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 'localhost';
var port = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || 8080;

//Reporting
//webapp.use(morgan('combined'));

//External Routing
webapp.get('/test', function (req, res) {
  console.log('works');
  res.send('Hello World!');
});

//webapp.use('/public', express.static(__dirname + '/public'));

//Webapp Initialize
webapp.listen(port, ip);
console.log('live on ip: ' + ip + ':' + port);

module.exports = webapp;
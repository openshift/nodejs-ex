//Dependencies
var express = require('express');
var	webapp = express();
var	Promise = require('promise');
var  morgan  = require('morgan');

//OpenShift Settings
var ip = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

//Reporting
webapp.use(morgan('combined'));

//External Routing
webapp.get('/', function (req, res) {
  console.log('works still?');
  res.send('Hello World!');
});

//webapp.use('/public', express.static(__dirname + '/public'));

//Webapp Initialize
webapp.listen(port, ip);
//console.log('live on ip: ' + ip + ':' + port);
console.log('Server running on http://%s:%s', ip, port);

module.exports = webapp;
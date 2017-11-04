//Dependencies
var express = require('express');
var	app = express();
//var	Promise = require('promise');
//var  morgan  = require('morgan');

//OpenShift Settings
var ip = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

//Reporting
//app.use(morgan('combined'));

//External Routing
app.get('/', function (req, res) {
  console.log('works as expected');
  res.send('<p>some html</p>');
  //res.send('Hello World Again!');
});

//app.use('/public', express.static(__dirname + '/public'));

//app Initialize
app.listen(port, ip);
//console.log('live on ip: ' + ip + ':' + port);
console.log('Server running on http://%s:%s', ip, port);
//console.log(JSON.stringify(process.env));

//module.exports = webapp;
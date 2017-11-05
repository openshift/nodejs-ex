//Dependencies
var express = require('express');
var	app = express();
var	Promise = require('promise');
var API = require(__dirname + '/API.js');

//OpenShift Settings
var ip = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

//External Routing Of Public Assets
app.use('/public', express.static(__dirname + '/public'));

//External Routing Of API
app.use('/api', API);

//External Other Routes
app.get('*', function (req, res) {
  console.log('works as expected');
  res.sendFile(__dirname + '/public/views/pages/index.html');
});

//app Initialize
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
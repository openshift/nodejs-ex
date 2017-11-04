//Dependencies
var express = require('express');
var	webapp = express();
var	Promise = require('promise');
var  morgan  = require('morgan');

console.log('process.env = ' + JSON.stringify(process.env));

//OpenShift Settings
var ip = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 'localhost';
var port = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || 8080;

//Reporting
webapp.use(morgan('combined'));

//External Routing

webapp.get('/', function(req, res) {
    console.log(__dirname);
    //res.sendFile(__dirname + '/public/views/pages/index.html');
    res.send('works');
});

webapp.use('/public', express.static(__dirname + '/public'));

//Webapp Initialize
webapp.listen(port, ip);
console.log('live on ip: ' + ip + ':' + port);

module.exports = webapp;
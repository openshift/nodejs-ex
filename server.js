//Dependencies
var express = require('express');
var	webapp = express();
var	Promise = require('promise');
var  morgan  = require('morgan');

//OpenShift Settings
var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

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
console.log('working again');

module.exports = webapp;
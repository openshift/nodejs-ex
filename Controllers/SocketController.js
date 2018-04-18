var express = require('express'),
    http = require("https"),
    //app     = express(),
    
    morgan  = require('morgan');
var path    = require("path");
const WebSocket = require('ws');
var router = express.Router();

router.get('/', function(req, res){
  let url = path.join(__dirname+'/../views/SocketController.html');
  //res.send(url);
 res.sendFile(url);
});
/*
let clients = [];
const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.onopen = function() {
    console.log('open');
    console.log("clients "+JSON.stringify(wss.clients));
  }
  
  ws.onclose = function() {
    console.log('close');
    console.log("clients "+JSON.stringify(wss.clients));
  }

  ws.on('message', function incoming(message) {
    //console.log('received: %s', message);
  });
 // ws.send('something');
});
*/

module.exports = router;
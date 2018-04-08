var fs = require('fs');

var options = {
    key: fs.readFileSync('fake-keys/privatekey.pem'),
    cert: fs.readFileSync('fake-keys/certificate.pem')
};

var express = require('express'),
    http = require("https"),
    app     = express(),
    morgan  = require('morgan');
var path    = require("path");
var router = express.Router();
const WebSocket = require('ws');
app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));

var server = require('http').createServer(options,app);
const wss = new WebSocket.Server({ server });

router.get('/', function(req, res){
  let url = path.join(__dirname+'/../views/SocketController.html');
  //res.send(url);
 res.sendFile(url);
});

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.send('something');
});


module.exports = router;
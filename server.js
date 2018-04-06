
//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
    const url = require('url');
    const WebSocket = require('ws');
var mongoose   = require('mongoose');
var graphql = require('graphql');
var AccountsController = require('./Controllers/AccountsController.js');

var routertest = require('./Controllers/routetest.js');

var mongoConnection = require('./GlobalConstant/mongoConnection');
var genericTestModel = require('./models/genericTestModel');

var randomProfile = require('random-profile-generator');
var fakerator = require("fakerator")();
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))


/*
console.log(process.env.mongoURL);
console.log(process.env.OPENSHIFT_NODEJS_PORT);
console.log(process.env.OPENSHIFT_NODEJS_IP);
console.log(process.env.OPENSHIFT_MONGODB_DB_URL);*/
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";
/*
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];
      
  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
   
  }else{
    console.log('Mongo Not Connected');
  }
}
else{
  console.log('Mongo null');
}
console.log('test socket');

*/

var server = require('http').createServer(app);


const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.send('something');
});



server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});

//IMPORTANT for mongodb Connection in openshift
//you can get the user and password from Application>secrect
//you can get the IP from the Cluster IP

var mongoDB = mongoConnection.connectionStr;//creates if not exist
console.log("Attempt to Connect to mongodb : "+mongoDB);
mongoose.connect(mongoDB);
console.log("Mongose Connection state : "+mongoose.connection.readyState);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

mongoose.connection.on('connected', function(){ console.log('connected mongoose');});
mongoose.connection.on('error', function(error){  
    console.log("------------");
    console.log("connection error :" +error);
    console.log("you can get the user and password from Application>secrect ");
    console.log("you can get the IP from the Cluster IP")
    console.log("------------")
});


mongoose.connection.on('disconnected', function(){  console.log('disconected');});

//Bind connection to error event (to get notification of connection errors)
/*db.on('error', function(){
    console.error.bind(console, 'MongoDB connection error:');
});*/
/*
db.once('open', function() {
  // we're connected!
    console.log('Connected mongo');
});*/


//creating schema
var kittySchema = mongoose.Schema({
  name: String
});
var Kitten = mongoose.model('Kitten', kittySchema);


//adding item to db
for(let i=0;i<2;i++){
    let fluffy = new Kitten({ name: 'fluffy'+i });
      fluffy.save(function (err, fluffy) {
        if (err) return console.error(err);
      });
    console.log(i);
}
Kitten.find({ name: /^fluff/ },function(err,res){//call backs
  if (err){ return console.error(err);}
}).skip(2).limit(10).sort({ _id : 1})//chaining
.then(function(doc){
  console.log("----------");
  console.log(JSON.stringify({items:doc}));
  console.log("----------");
  console.log({items:doc});
});
var query = { _id: '5aabff12b42d05095069c27c' };
Kitten.update(query, { name: 'jason bourne' }, function(err,doc){//reverse remove
  if (err) {return console.error(err);}
  console.log("Updated Matchs: ");
},function(err,doc){
});
var query2 = { _id: '5aabff12b42d05095069c27c' };
Kitten.findOneAndUpdate(query2, { name: 'jason bourne2' }, function(err,doc){//findOneAndRemove
  console.log("Updated One: ");
},function(err,doc){
});

let Employee= genericTestModel.employee;
let ExtraInfo = genericTestModel.extraInfo;

let extraInfo = new ExtraInfo({ name: 'extra info test' });
let employee = new Employee({ name: 'test External Model',extraInfo:extraInfo });

employee.save(function (err, fluffy) {
  if (err) return console.error("generic test Model "+err);
});

Employee.find({ name: /^test/ },function(err,res){//call backs
  if (err){ return console.error(err);}
}).then(function(doc){
  console.log("-----employee external-----");
  console.log(JSON.stringify({items:doc}, undefined, '\ '));
  console.log("----------");
});




/*var io = require('socket.io')(server);
var roomno = 0;
io.on('connection', function(client){
  console.log('Client connected...');
  var room = "abc123";
  client.on('join', function(data) {
    console.log("Default Room  : "+data);
    client.join(data);
  });

  roomno++;
  
  io.sockets.emit('roomcount',roomno);//to emit to client

  io.sockets.in(room).emit('message', 'what is going on, party people?');//the in is the room it self emit is the message to the room



  client.on('event', function(data){});
  client.on('disconnect', function(){
     console.log('test disconect socket');
      roomno--;
    });

});

//server.listen(3000);
server.listen(8080);

*/


console.log(ip+":"+port);

var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};
//app.get('/', (req, res) => res.send('Hello World!'));


app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});
app.use('/routetest', routertest);
app.use('/AccountsController', AccountsController);

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

//app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;

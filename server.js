//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    bodyParser = require("body-parser"),
    eps     = require('ejs'),
    morgan  = require('morgan');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL ,
    mongoURLLabel = "";
console.log('wwwwwww');
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME || 1) {
  // var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
  //     mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
  //     mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
  //     mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
  //     mongoPassword = process.env[mongoServiceName + '_PASSWORD']
  //     mongoUser = process.env[mongoServiceName + '_USER'];

      //===========================
    var  mongoHost = "ds111882.mlab.com",
      mongoPort = "11882",
      mongoDatabase = "testdbvk",
      mongoUser = "vikramvk",
      mongoPassword = "test123#";

console.log('wwwwwww xxxx');

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

    console.log(mongoURLLabel);
    console.log(mongoURL);
  }
}
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

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.  res.header("Content-Type", "text/cache-manifest");
  // res.header("  Content-Type", "text/cache-manifest");

console.log('xxxxxxxx');
  if (!db) {
    console.log('adasda');
    initDb(function(err){});
  }
  res.send({
    users: ["Will", "Laura"]
  });

  // if (db) {
  //   console.log('wwwwww');
  //   var col = db.collection('counts');
  //   // Create a document with request IP and current time of request
  //   col.insert({ip: req.ip, date: Date.now()});
  //   col.count(function(err, count){
  //     res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
  //   });
  // } else {
  //   console.log('zzzzzz');
  //   res.render('index.html', { pageCountMessage : null});
  // }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('users').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

app.post('/singup', function(req, res) {
    res.set('Content-Type', 'application/json');
    console.log(req.body.email);
    checkDB(res);
    if(req.body.email == ""  || req.body.email == nil || req.body.password == ""  || req.body.password == nil) {
        res.send('{"status":0, "message":"params missing"}');
    } else {
      db.collection('users').insert(req.body, function(error, records){
        if(error) {
          res.send('{"status":0,"message":"User already exist"}');
        } else {
          res.send('{"status":1, "message":"Singup success"}');
        }
      });
    }

});

app.post('/login', function(req, res) {
    res.set('Content-Type', 'application/json');
    checkDB(res);
    db.collection('users').find({ 'password': req.body.password,'email': req.body.email }).toArray(function(err, items) {
      if(err) {
        res.send('{"status":0,"message":"Server error"}');
      } else {
        if (items.length) {
          console.log('{"status":1, "message":"Login success", "data":'+items[0]+'}');
            res.send('{"status":1, "message":"Login success", "data":'+JSON.stringify(items[0])+'}');
        } else {
            res.send('{"status":0,"message":"Email or passwor ot match."}');
        }

      }
    });
});


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

function checkDB(res) {
  if(!db) {
    res.send('{"status":0,"message":"Server db error"}');
  }
}


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

app.get('/test/', function (req, res) {
  res.send({
    users: ["Will", "Laura"]
  });
});




module.exports = app ;

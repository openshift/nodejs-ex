
//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    const url = require('url');
    const WebSocket = require('ws');
    const CircularJSON = require('circular-json');// a better json string and parse

const uuid = require('uuid');

var os = require('os');
//var osutil = require('os-utils');//not working on remote
var mongoose   = require('mongoose');
var async = require("async");
var graphql = require('graphql');
var Combinatorics = require('js-combinatorics');


var AccountsController = require('./Controllers/AccountsController.js');
var SocketController = require('./Controllers/SocketController.js');

var routertest = require('./Controllers/routetest.js');

var mongoConnection = require('./GlobalConstant/mongoConnection');
var genericTestModel = require('./models/genericTestModel');

var randomProfile = require('random-profile-generator');
var fakerator = require("fakerator")();

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

function loopTest() {//slow testing
  var test = 0
  for (var i=0; i<=100000; i++) {
      test +=1
  }
  return test
}

/*
console.log(process.env.mongoURL);
console.log(process.env.OPENSHIFT_NODEJS_PORT);
console.log(process.env.OPENSHIFT_NODEJS_IP);
console.log(process.env.OPENSHIFT_MONGODB_DB_URL);*/
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";
    
var server = require('http').createServer(app);

console.log("-------Combinator----------");
var cmb, a;
cmb = Combinatorics.power(['a','b','c']);
cmb.forEach(function(a){ console.log(a) });
console.log("-------Combinator----------");



//------poker evaluator
console.log("-------Poker----------");
  const PokerHand = require('poker-hand-evaluator');
 
  const myPokerHand = new PokerHand('KS KH QC AH AD');
  const hisPokerHand = new PokerHand('KD KC AS AH TD')
   
  console.log(myPokerHand.describe());
  // { hand: [ 'KS', 'KH', 'QC', 'AH', 'AD' ],
  //   score: 2468,
  //   rank: 'TWO_PAIRS' }
   
  console.log(hisPokerHand.describe());
  // { hand: [ 'KD', 'KC', 'AS', 'AH', 'TD' ],
  //   score: 2470,
  //   rank: 'TWO_PAIRS' }
   
  console.log(myPokerHand.getRank());
  // TWO_PAIRS
  console.log(hisPokerHand.getRank());
  // TWO_PAIRS
   
  console.log(myPokerHand.getScore());
  // 2468
  console.log(hisPokerHand.getScore());
  // 2470
   
  console.log(myPokerHand.toString());
  // KS KH QC AH AD
  console.log(hisPokerHand.toString());
  // KD KC AS AH TD
   
   
  /**
   * return 1 if it's a Win
   * return 2 if it's a Loss
   * return 3 if it's a Tie
   */
  console.log(myPokerHand.compareWith(hisPokerHand));
console.log("-------Poker end------");
//------poker evaluator








//-----sockets start here

//the socketcontroller.js calls this while socketcontroller.js is called by socketcontroller.html
let clients =[];

let totalclient;

function noop() {}

function heartbeat() {
  this.isAlive = true;
}


function clientsConnectionUUIDList(){//returns a class object
  //remap
  var UUID = clients.map(item => ({ id: item.id, ip: item.ip,isAlive:item.isAlive }));
  return UUID;
}


const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws,req) {
  const ip = req.connection.remoteAddress;
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
/*
  var found = array1.find(function(element) {
    return element > 10;
  });*/
  
  ws.id = uuid.v4();//append a property to a client to know the diffrences
  ws.ip = ip;


  clients.push(ws);




  var socketClient = class {
    
    constructor(ip,id) {
      this.ip = ip;
      this.id = id;
      
      this.root =[]; //root representing an array of json
      let userobject={};// user the information of other connections for connection
      userobject.type="";//the identifer type of object
      userobject.time="";
      userobject.usercontainer=[];
      let user ={};
      user.ip=this.ip;
      user.connectionid=this.id;
      user.otherConnection=[];//object containing other
      userobject.usercontainer.push(user);
      this.root.push(userobject);

    
    }


    getclientobject() {
      //you can only access it by a index first before getting any prams due to root being an array
      //no need to access the class name e.g this.root[0]userobject.type you INSTEAD use  this.root[0].type
      this.root[0].type="ConnectionList";
      this.root[0].time=new Date();
      this.root[0].usercontainer[0].otherConnection=clientsConnectionUUIDList();
      return this.root;
    }

 
  }
  
  ws.socketClient = new socketClient(ws.ip,ws.id);
  

  async.forever(
      function(next) {

        
 

      
     /* for(var i=0;i<clients.length;i++){
        if (clients[i].readyState === WebSocket.OPEN) {//makes sure its 
            try{
           // var tosend =CircularJSON.stringify(clients[i].socketClient.getclientobject());

            clients[i].send('test', function ack(error) {//send the message with error check
              // If error is not defined, the send has been completed, otherwise the error
              // object will indicate what failed.
              console.log("error sending root "+error);
            });
          }catch(e){
            console.log("error "+e);
          }

        }
      }*/
    
      clients.forEach(function(client) {//we loop in wss because we need the latest connections
            if (client!=undefined&&client!=null&&client.readyState === WebSocket.OPEN) {//makes sure its ready
              var tosend =CircularJSON.stringify(client.socketClient.getclientobject());
              if(tosend!=undefined&&tosend!=null&&tosend!=""){
                client.send(tosend);
              }
             // var tosend =CircularJSON.stringify(client.socketClient.getclientobject());
             // console.log("sent : "+ tosend);
        
             
            };
            
            setTimeout(function() {
              next();//self execute again
            }, 1000);
      }
      
      ,
        function(err) {
            // if next is called with a value in its first parameter, it will appear
            // in here as 'err', and execution will stop.
            console.log('async close check error : '+ err)
        }
      );
    
    }

  );

  ws.onopen = function() {
    console.log('open');
    totalclient++;
  }
  ws.onclose = function(client) {
    
    console.log('close client ');
  
   totalclient--;
  }
  ws.on('error', function(err) {
    console.debug('Found error: ' + err);
  });

  ws.on('message', function incoming(message) {
    //console.log('received: %s', message);
  //  console.log("clients length "+totalclient);
    
  });
  




/*checking for connection states*/
/*
async.forever(
  function(next) {
    
    UpdateClientList();


    clients.forEach(function each(ws) {
      
      if (ws.readyState === WebSocket.CLOSED){
      //  console.log('CLOSED id '+ws.id +' ip '+ws.ip);
      }
      if (ws.readyState === WebSocket.OPEN){
      //  console.log('OPEN  id '+ws.id +' ip '+ws.ip);
      }
    });
      setTimeout(function() {
        next();//self execute again
    }, 1000);
  },
  function(err) {
      // if next is called with a value in its first parameter, it will appear
      // in here as 'err', and execution will stop.
      console.log('async close check error : '+ err)
  }
);
*/





  //send connection information after connecting 
  /*ws.send(JSON.stringify(root), function ack(error) {//send the message with error check
    // If error is not defined, the send has been completed, otherwise the error
    // object will indicate what failed.
    console.log(error);
  });*/




  /* ws.send('connected', function ack(error) {//send the message with error check
    // If error is not defined, the send has been completed, otherwise the error
    // object will indicate what failed.
    console.log(error);
  });*/
});


function UpdateClientList(){
 
}


const interval = setInterval(function ping() {
  clients.forEach(function each(ws) {
    if (ws.readyState === WebSocket.CLOSED){
        ws.isAlive=false;
      }
      if (ws.readyState === WebSocket.OPEN){
        ws.isAlive=true;
      }
  });
}, 1000);




//----sockets end here


/*
async.forever(
  function(next) {
      // next is suitable for passing to things that need a callback(err [, whatever]);
      // it will result in this function being called again.
      console.log('test forever');
      loopTest();
      setTimeout(function() {
        next();//self execute again
    }, 500);
  },
  function(err) {
      // if next is called with a value in its first parameter, it will appear
      // in here as 'err', and execution will stop.
  }
);
*/



var functs = [];
function HelloWorldOne(callback){
 setTimeout(function(){
    //  console.log("HelloWorld - One");
      loopTest();
      callback();
  }, Math.floor(1000));
}
for(var i=0;i<5;i++){
  functs.push(HelloWorldOne);
}

  
var dataObj =[];
for(var i =0;i<10000;i++){//create object
  dataObj.push(i);
}
/*
setInterval(()=>{
   console.log('good not blocked.')
 },100);//to test if its not blocked 
*/

/*
 async.forever(
  function(next) {

    setTimeout(function() {
      console.log('good not blocked.');
      os.cpuUsage(function(v){
        console.log( 'CPU Usage (%): ' + v+ " Usage "+os.freemem() );
      });
      next();
    }, 1000);
  },
  function(err) {
      // if next is called with a value in its first parameter, it will appear
      // in here as 'err', and execution will stop.
  }
 );
*/
async.forever(
  function(next) {
      async.each(Object.keys(dataObj), function (item, callback){ 
       loopTest();//operation here
        setTimeout(function() {
        //  console.log(item);
          callback();
         
      }, 5000);
      // tell async that that particular element of the iterator is done
      }, function(err) {
      console.log('iterate done----------------');
      next();
      });  
  },
  function(err) {
      // if next is called with a value in its first parameter, it will appear
      // in here as 'err', and execution will stop.
  }
);



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



server.listen(8080);




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

app.use("/dist", express.static(__dirname + "/dist"));
app.use("/public", express.static(__dirname + "/public"));//so we can include external client side js or css files without routing it manually w
app.use("/Dashboard", express.static(__dirname + "/Dashboard"));//so we can include external client side js or css files without routing it manually w

app.use("/Poker", express.static(__dirname + "/Poker"));

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


app.get('/vuetest', function (req, res) {
      res.render('vuetest.html');
});

app.get('/asyncclient', function (req, res) {
  res.render('asyncclient.html');
});

app.get('/plotlytest', function (req, res) {
  res.render('plotlytest.html');
});
app.get('/vuevaliddate', function (req, res) {
  res.render('vuevaliddate.html');
});
app.get('/babeltest', function (req, res) {
  res.render('babeltest.html');
});
app.get('/webpackdevservertest', function (req, res){
  res.render('webpackdevservertest.html');
});
app.get('/estest', function (req, res){
  res.render('estest.html');
});


app.get('/jsontest', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(
  { Title: 1,Link : '/somthing' },
  { Title: 2,Link : '/somthing1' },
  { Title: 3,Link : '/somthing2' },
  { Title: 4,Link : '/somthing3' }
));
});


app.use('/routetest', routertest);
app.use('/AccountsController', AccountsController);
app.use('/SocketController', SocketController);


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

'use strict';

//  OpenShift sample Node application
const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  MongoClient = require('mongodb').MongoClient;

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongoInfo = getMongoInfo();

const dbPromise = MongoClient.connect(mongoInfo.url);

app.get('/', function (req, res, next) {
  return dbPromise.then((db) => {
    const countsCol = db.collection('counts');

    return countsCol.insert({ ip: req.ip, date: Date.now() })
      .then(() => countsCol.count())
      .then((count) => {
        res.render('index.html', {
          pageCountMessage: count,
          dbInfo: {
            databaseName: db.databaseName,
            url: mongoInfo.label,
            type: 'MongoDB'
          }
        });
      })
  })
  .catch(next);
});

app.get('/pagecount', function (req, res, next) {
  return dbPromise.then((db) => db.collection('counts').count())
    .then((count) => res.json({
      pageCount: count
    }))
    .catch(next);
});

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack || err);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip, () => console.log('Server running on http://%s:%s', ip, port));

// In case there was an error initializing the database
dbPromise.catch((err) => {
  console.error('Error initializing database:', err.stack || err);
  process.exit(-1);
});



function getMongoInfo() {
  const mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
  if (mongoURL) {
    return {
      url: mongoURL,
      label: ''
    };
  }

  const serviceName = process.env.DATABASE_SERVICE_NAME;
  if (!serviceName) {
    throw new Error('One of OPENSHIFT_MONGODB_DB_URL|MONGO_URL|DATABASE_SERVICE_NAME env variables must be defined');
  }

  const mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
    mongoPassword = process.env[mongoServiceName + '_PASSWORD']
  mongoUser = process.env[mongoServiceName + '_USER'];

  if (!mongoHost || !mongoPort || !mongoDatabase) {
    throw new Error('When using DATABASE_SERVICE_NAME, you must also provide _SERVICE_HOST, _SERVICE_PORT, and _DATABASE env variables');
  }

  let mongoAuth = '';
  if (mongoUser && mongoPassword) {
    mongoAuth = mongoUser + ':' + mongoPassword + '@';
  }

  const url = mongoHost + ':' + mongoPort + '/' + mongoDatabase;
  return {
    url: 'mongodb://' + mongoAuth + url,
    label: 'mongodb://' + url
  };

}

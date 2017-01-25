'use strict'

/*
  NodeJS OpenShift Origin example for node 0.1xx and 4.xx
*/

var express = require('express')
var morgan = require('morgan')
var mongoose = require('mongoose')

var app = module.exports = express()

app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)
app.use(morgan('combined'))

var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL
// NOTE: when mongoURL was provided, we never set mongoURLLabel, which means it
// will be empty in the UI. (broken by default)
var mongoURLLabel = ''

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  // TODO: improve a bit on this ugliness
  let mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase()
  let mongoHost = process.env[mongoServiceName + '_SERVICE_HOST']
  let mongoPort = process.env[mongoServiceName + '_SERVICE_PORT']
  let mongoDatabase = process.env[mongoServiceName + '_DATABASE']
  let mongoPassword = process.env[mongoServiceName + '_PASSWORD']
  let mongoUser = process.env[mongoServiceName + '_USER']

  if (mongoHost && mongoPort && mongoDatabase) {
    let mongoURLLabel = mongoURL = 'mongodb://'
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@'
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase
    mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase
  }
}

var dbConnection = function () {
  let db = mongoose.connect(mongoURL)
  // clear previously assigned event listeners so that we don't reach the limit
  db.connection.removeAllListeners()
  db.connection.once('error', function (err) {
    console.error('Database connection error: %s', err)
  })
  db.connection.once('disconnected', function () {
    console.log('Database disconnected from %s', mongoURL)
  })
  db.connection.once('open', function () {
    db.dbDetails = {
      type: 'MongoDB',
      databaseName: db.name,
      url: mongoURLLabel
    }
    console.log('Connected to database %s', mongoURL)
  })

  db.model = function () {
    // only register the schema if it wasn't previously registered.
    // otherwise return the model.
    if (!mongoose.models.Counts) {
      return mongoose.model('Counts',
        new db.Schema({
          ip: String,
          date: {type: Date, default: Date.now}
        })
      )
    } else {
      return mongoose.model('Counts')
    }
  }
  return db
}

var countHits = function (db, callback) {
  let countsModel = db.model()
  countsModel.count({}, function (err, count) {
    if (err) {
      console.error('An error occured retrieving data %s', err)
      callback(undefined)
    }
    callback(count)
  })
}

function insertHits (ip, callback) {
  let db = dbConnection()
  let NewCountsModel = new db.model()
  new NewCountsModel({ip: ip})
  .save(function (err) {
    if (err) {
      console.error('An error occured while saving the data %s', err)
    }
    countHits(db, function (count) {
      let results = {
        dbInfo: db.dbDetails,
        pageCountMessage: count
      }
      callback(results)
    })
  })
}

app.get('/', function (req, res) {
  insertHits(req.ip, function (results) {
    results || {
      dbInfo: null,
      pageCountMessage: null
    }
    mongoose.disconnect()
    res.render('index', {
      dbInfo: results.dbInfo,
      pageCountMessage: results.pageCountMessage
    })
  })
})

app.get('/pagecount', function (req, res) {
  let db = dbConnection()
  countHits(db, function (results) {
    results || {'pageCount': -1}
    db.disconnect()
    res.send(JSON.stringify({pageCount: results}))
  })
})

var server = app.listen(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080, process.env.HOST || '0.0.0.0')

server.once('error', function (err) {
  if (err) {
    console.error('Server error: %s', err)
  }
})

server.once('listening', function () {
  let host = server.address().address
  let port = server.address().port
  console.log('Application accessible on http://%s:%s', host, port)
})

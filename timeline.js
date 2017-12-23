// Export a function which will create the
// router and return it
 
var express = require('express')
var visjs = require('vis')
 
module.exports = function profile(){
 
  var router = express.Router();
 
  // Capture all requests, the form library will negotiate
  // between GET and POST requests
 
  router.all('/', function(req, res) {	
    res.render('timeline.html', { events : [
    {id: 1, content: 'item 1', start: '2014-04-20'},
    {id: 2, content: 'item 2', start: '2014-04-14'},
    {id: 3, content: 'item 3', start: '2014-04-18'},
    {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
    {id: 5, content: 'item 5', start: '2014-04-25'},
    {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'}
  ]});
  });
 
  // This is an error handler for this router
 
  router.use(function (err, req, res, next) {
    console.error(err.stack);
	res.status(500).send('Something bad happened!');
  });
 
  return router;
};
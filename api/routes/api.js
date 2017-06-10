'use strict';
module.exports = function(app) {
  var tasks = require('./tasks');
  app.route('/tasks',tasks);

};

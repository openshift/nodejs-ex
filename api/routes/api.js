'use strict';
module.exports = function(app) {
  app.route('/tests').get(function(req,res){
    res.send('Hi tests');
  });

};

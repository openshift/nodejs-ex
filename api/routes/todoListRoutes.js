'use strict';
module.exports = function(app) {
  //var todoList = require('../controllers/todoListController');
  
  app.route('/api/test')
    .get((req,res)=>{ res.send('testing here'); });

  app.get('/tasks',(req, res) => {
    res.send('Tasks is here')
  });
/*
  // todoList Routes
  app.route('/tasks')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);


  app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);
*/    
};

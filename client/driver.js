var Marionette = require('backbone.marionette');
var Router = require('./router');


var initialData = {
  posts: [
    {
      author: 'Scott',
      title: 'Why Marionette is amazing',
      content: '...',
      id: 42,
      comments: [
        {
          author: 'Steve',
          content: '...',
          id: 56
        }
      ]
    },
    {
      author: 'Andrew',
      title: 'How to use Routers',
      content: '...',
      id: 17
    }
  ]
};


var App = new Marionette.Application({
  onStart: function(options) {
    var router = new Router(options);

    /** Starts the URL handling framework */
    Backbone.history.start();
  }
});

App.start({initialData: initialData});

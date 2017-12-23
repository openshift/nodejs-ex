var LayoutView = require('./views/layout');
var BlogList = require('./collections/blog');


var Controller = Marionette.Object.extend({
  initialize: function() {
    /** The region manager gives us a consistent UI and event triggers across
        our different layouts.
    */
    this.options.regionManager = new Marionette.RegionManager({
      regions: {
        main: '#blog-hook'
      }
    });
    var initialData = this.getOption('initialData');

    var layout = new LayoutView({
      collection: new BlogList(initialData.posts)
    });

    this.getOption('regionManager').get('main').show(layout);

    /** We want easy access to our root view later */
    this.options.layout = layout;
  },

  /** List all blog entrys with a summary */
  blogList: function() {
    var layout = this.getOption('layout');
    layout.triggerMethod('show:blog:list');
  },

  /** List a named entry with its comments underneath */
  blogEntry: function(entry) {
    var layout = this.getOption('layout');
    layout.triggerMethod('show:blog:entry', entry);
  }
})

var Router = Marionette.AppRouter.extend({
  appRoutes: {
    'blog/': 'blogList',
    'blog/:entry': 'blogEntry'
  },

  /** Initialize our controller with the options passed into the application,
      such as the initial posts list.
  */
  initialize: function() {
    this.controller = new Controller({
      initialData: this.getOption('initialData')
    });
  }
});

module.exports = Router;

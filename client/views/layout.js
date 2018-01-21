var List = require('./list');
var Blog = require('./blog');


var LayoutView = Marionette.LayoutView.extend({
  template: require('../templates/blog/layout.html'),

  regions: {
    layout: '.layout-hook'
  },

  onShowBlogList: function() {
    var list = new List({collection: this.collection});
    this.showChildView('layout', list);

    /*  Remember - this only sets the fragment, so we can safely call this as
        often as we like with no negative side-effects.
    */
    Backbone.history.navigate('blog/');

  },

  onShowBlogEntry: function(entry) {
    var model = this.collection.get(entry);
    this.showBlog(model);
  },

  onChildviewSelectEntry: function(child, model) {
    this.showBlog(model);
  },

  /** Child-initiated alias to onShowBlogList */
  onChildviewShowBlogList: function() {
    this.triggerMethod('show:blog:list');
  },

  /** Share some simple logic from our subviews */
  showBlog: function(blogModel) {
    var blog = new Blog({model: blogModel});
    this.showChildView('layout', blog);

    /*  Remember - this only sets the fragment, so we can safely call this as
        often as we like with no negative side-effects.
    */
    Backbone.history.navigate('blog/' + blog.id);
  }
});

module.exports = LayoutView;

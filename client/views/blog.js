var Comment = Marionette.LayoutView.extend({
  tagName: 'li',
  template: require('../templates/blog/comment.html')
});

var CommentListView = Marionette.CollectionView.extend({
  tagName: 'ol',
  childView: Comment
});

var Blog = Marionette.LayoutView.extend({
  template: require('../templates/blog/blog.html'),

  regions: {
    comments: '.comment-hook'
  },

  ui: {
    back: '.back'
  },

  triggers: {
    'click @ui.back': 'show:blog:list'
  },

  onShow: function() {
    var comments = new CommentList(this.model.get('comments'));
    var commentView = new CommentListView({collection: comments});

    this.showChildView('comments', commentView);
  }
});

module.exports = Blog;

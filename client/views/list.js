var Entry = Marionette.LayoutView.extend({
  template: require('../templates/blog/item.html'),
  tagName: 'li',

  triggers: {
    click: 'select:entry'
  }
});


var BlogList = Marionette.CollectionView.extend({
  childView: Entry,
  tagName: 'ul',

  onChildviewSelectEntry: function(child, options) {
    this.triggerMethod('select:entry', child.model);
  }
});

module.exports = BlogList;

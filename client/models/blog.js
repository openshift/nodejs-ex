module.exports = Backbone.Model.extend({
  /** Let us inject 0 comments in from the data set
  */
  defaults: function() {
    return {
      comments: []
    }
  }
});

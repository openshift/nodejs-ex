var monngoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  name: { type: String, Required: 'Kindly enter the name of the task'},
  Created_date: {type: Date, default: Date.now},
  status: { type:['pending','ongoing','completed'],default:['pending']}
});

module.exports = mongoose.model('Task',TaskSchema);

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var GlobalConstant = require('../GlobalConstant/mongoConnection');
mongoose.connect(GlobalConstant.mongoConnection);

var employeeSchema = new Schema({
    name: String,
    address: String,
    phone: String,
    email: String
});

module.exports = mongoose.model('Employee', employeeSchema);
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var GlobalConstant = require('../GlobalConstant/mongoConnection');
mongoose.connect(GlobalConstant.conn);

let employeeSchema = new Schema({
    name: String,
    address: String,
    phone: String,
    email: String
});

module.exports.Employee = mongoose.model('Employee', employeeSchema);
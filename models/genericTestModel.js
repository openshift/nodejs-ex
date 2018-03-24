var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var GlobalConstant = require('../GlobalConstant/mongoConnection');
mongoose.connect(GlobalConstant.conn);

let employeeSchema = new Schema({
    name: String

});
let employee= mongoose.model('Employee', employeeSchema);

module.exports.employeeSchema = employeeSchema;
module.exports.employee = employee;
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var GlobalConstant = require('../GlobalConstant/mongoConnection');
mongoose.connect(GlobalConstant.connectionStr);

let extraInfo = new Schema({
    name: String
});

let employeeSchema = new Schema({
    name: String,
    extraInfo:[extraInfo]

});


let employee= mongoose.model('Employee', employeeSchema);

module.exports.extraInfo = extraInfo;
module.exports.employeeSchema = employeeSchema;
module.exports.employee = employee;

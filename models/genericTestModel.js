var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var GlobalConstant = require('../GlobalConstant/mongoConnection');
mongoose.connect(GlobalConstant.connectionStr);

let extraInfoSchema = new Schema({
    name: String
});

let employeeSchema = new Schema({
    name: String,
    extraInfo:[extraInfoSchema]

});


let employee= mongoose.model('Employee', employeeSchema);
let extraInfo= mongoose.model('ExtraInfo', extraInfoSchema);

module.exports.extraInfo = extraInfoSchema;
module.exports.employeeSchema = employeeSchema;
module.exports.employee = employee;
module.exports.extraInfo = extraInfo;
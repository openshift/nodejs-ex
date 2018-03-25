var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var GlobalConstant = require('../GlobalConstant/mongoConnection');
mongoose.connect(GlobalConstant.connectionStr);

let GeoSchema = new Schema({
    latitude: { type: Number, default: 0  },
    longitude: { type: Number, default: 0  }
});

let BasicInformationSchema = new Schema({
    Address: { type: String, default: undefined  },
    Birthday: { type: String, default: undefined  },
    City: { type: String, default: undefined  },
    Email: { type: String, default: undefined  },
    Name: { type: String, default: undefined  },
    Surname: { type: String, default: undefined  },
    PhoneNumber: { type: String, default: undefined  },
    Role: { type: String, default: undefined  },
    FacebookLink: { type: String, default: undefined  }
});
let UserLogSchema = new Schema({
    IP: { type: String, default: undefined  },
    Time: { type: String, default: undefined  },
    Date: { type: String, default: undefined  }
});
let ReviewSchema = new Schema({
    Content: { type: String, default: undefined  },
    Title: { type: String, default: undefined  },
    Type: { type: String, default: undefined  },
    UserName: { type: String, default: undefined  },
});
let CompletedSchema = new Schema({
    Date: { type: String, default: undefined  },
    Time: { type: String, default: undefined  },
});
let RequestSchema = new Schema({
    Date: { type: String, default: undefined  },
    Time: { type: String, default: undefined  },
});
let ClosedSchema = new Schema({
    CloseBy: { type: String, default: undefined  },
    CloseReason: { type: String, default: undefined  },
});
let NotificationSchema = new Schema({
    RequestTicketUUID: { type: String, default: undefined  },
    UserName: { type: String, default: undefined  },
});

let RequestTicketSchema = new Schema({
    Request:[RequestSchema],
    Notification:[NotificationSchema],
    Completed:[CompletedSchema],
    Closed:[ClosedSchema],
    Review:[ReviewSchema],
    Origin: [GeoSchema],
    Destination:[GeoSchema],
    Status: { type: String, default: undefined  },
    Task: { type: String, default: undefined  },
    UUID:{ type: String, default: undefined  },
    Category:{ type: String, default: undefined  }
});

let AccountSchema = new Schema({
    BasicInformation:[BasicInformationSchema],
    RequestTicket:[RequestTicketSchema],
    UserLog:[UserLogSchema],
    AccountStatus:{ type: String, default: undefined  },
    Location: { type: String, default: undefined  },
    OnlineStatus: { type: String, default: undefined },
    Password: { type: String, default: undefined  },
    RegisterDate: { type: String, default: undefined },
    Role: { type: String, default:undefined },
    SecurityQuestion: { type: String, default: undefined  },
    UserName: { type: String, default: undefined  },
    UUID: { type: String, default: undefined  }
});

let Account= mongoose.model('Account', AccountSchema);
let Notification= mongoose.model('Notification', NotificationSchema);
let Closed= mongoose.model('Closed', ClosedSchema);
let Request= mongoose.model('Request', RequestSchema);
let Completed= mongoose.model('Completed', CompletedSchema);
let Review= mongoose.model('Review', ReviewSchema);
let RequestTicket= mongoose.model('RequestTicket', RequestTicketSchema);
let UserLog= mongoose.model('UserLog', UserLogSchema);
let BasicInformation= mongoose.model('BasicInformation', BasicInformationSchema);
let Geo= mongoose.model('Geo', GeoSchema);

module.exports.AccountSchema = AccountSchema;
module.exports.NotificationSchema = NotificationSchema;
module.exports.ClosedSchema = ClosedSchema;
module.exports.RequestSchema = RequestSchema;
module.exports.CompletedSchema = CompletedSchema;
module.exports.ReviewSchema = ReviewSchema;
module.exports.RequestTicketSchema = RequestTicketSchema;
module.exports.UserLogSchema = UserLogSchema;
module.exports.BasicInformationSchema = BasicInformationSchema;
module.exports.GeoSchema = GeoSchema;

module.exports.Account = Account;
module.exports.Notification = Notification;
module.exports.Closed = Closed;
module.exports.Request = Request;
module.exports.Completed = Completed;
module.exports.Review = Review;
module.exports.RequestTicket = RequestTicket;
module.exports.Request = Request;
module.exports.UserLog = UserLog;
module.exports.BasicInformation = BasicInformation;
module.exports.Geo = Geo;

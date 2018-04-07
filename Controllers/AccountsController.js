//ACCOUNTS CONTROLLER
var AccountsModel = require('../models/AccountsModel');
var randomProfile = require('random-profile-generator');
var fakerator = require("fakerator")();
var mongoConnection = require('../GlobalConstant/mongoConnection');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send('GET route on things.');
 });
 router.get('/Create', function(req, res){
    createAccounttest() ;
    res.send('Get route Added User');
 });
 router.get('/Update', function(req, res){

    res.send('GET route Update things.');
 });
 router.get('/List', function(req, res){
    let Account = AccountsModel.Account;
    let listed =Account.collection.find();
    listed.find({},function(err,res){//call backs
        if (err){ return console.error(err);}
      })
      .then(function(doc){
        console.log("----------");
        console.log(JSON.stringify({items:doc}));
        res.send(JSON.stringify({items:doc}));
        console.log("----------");
        console.log({items:doc});
      });
    
 });


 router.get('/Delete', function(req, res){
    dropAccount();
    res.send('GET route Drop things.');
 });

 router.get('/:id', function(req, res){//this still uses a route not a query string
    const id = req.params.id;
    res.send('GET route Drop things.'+id);
 });
 


 router.post('/', function(req, res){
    res.send('POST route on things.');
 });


function dropAccount(){
    let Account = AccountsModel.Account;
    Account.collection.drop();
}
function createAccounttest() {
    let Account = AccountsModel.Account;
    let Notification = AccountsModel.Notification;
    let Closed = AccountsModel.Closed;
    let Request = AccountsModel.Request;
    let Completed = AccountsModel.Completed;
    let Review = AccountsModel.Review;
    let RequestTicket = AccountsModel.RequestTicket;
    let UserLog = AccountsModel.UserLog;
    let BasicInformation = AccountsModel.BasicInformation;
    let Geo = AccountsModel.Geo;
    //--randomizer
    let gender = randomProfile.gender();
    let address = randomProfile.address();
    let birthday = randomProfile.birthday();
    let completedDate = new Date().toLocaleDateString();
    let completedTime = new Date().toLocaleTimeString();
    let requestedTime = new Date().toLocaleDateString();
    let requestedDate = new Date().toLocaleTimeString();
    let userLogTime = new Date().toLocaleTimeString();
    let userLogDate = new Date().toLocaleDateString();
    let registerDate = new Date().toLocaleDateString();
    let name = fakerator.names.firstName();
    let lastname = fakerator.names.lastName();
    let phone = fakerator.phone.number();
    let email = fakerator.internet.email();
    let state = fakerator.address.countryCode();
    let city = fakerator.address.city();
    let location = new Geo({ latitude: fakerator.address.geoLocation().latitude, longitude: fakerator.address.geoLocation().longitude });
    let origin = new Geo({ latitude: fakerator.address.geoLocation().latitude, longitude: fakerator.address.geoLocation().longitude });
    let destination = new Geo({ latitude: fakerator.address.geoLocation().latitude, longitude: fakerator.address.geoLocation().longitude });
    let username = fakerator.internet.password(12);
    let password = fakerator.internet.password(12);
    let ipAddress = fakerator.internet.ip();
    let title = fakerator.lorem.sentence();
    let content = fakerator.lorem.sentence();
    let type = fakerator.lorem.sentence();
    let task = fakerator.lorem.sentence();
    let closeBy = 'closeBy';
    let closeReason = fakerator.lorem.sentence();
    let category = fakerator.lorem.sentence();
    let accountUuid = fakerator.misc.uuid();
    let requestTicketUUID = fakerator.misc.uuid();
    //--randomizer test
    console.log("---randomizetest---");
    console.log(gender);
    console.log(address);
    console.log(birthday);
    console.log(completedDate);
    console.log(completedTime);
    console.log(requestedDate);
    console.log(requestedTime);
    console.log(userLogTime);
    console.log(userLogDate);
    console.log(registerDate);
    console.log(name);
    console.log(lastname);
    console.log(phone);
    console.log(email);
    console.log(state);
    console.log(city);
    console.log(location);
    console.log(origin);
    console.log(destination);
    console.log(username);
    console.log(password);
    console.log(ipAddress);
    console.log(title);
    console.log(content);
    console.log(type);
    console.log(task);
    console.log(closeBy);
    console.log(closeReason);
    console.log(category);
    console.log(accountUuid);
    console.log(requestTicketUUID);
    console.log("------");
    let basicInformation = new BasicInformation({
        Address: '' + address,
        Birthday: '' + birthday,
        City: '' + state,
        Email: '' + email,
        Name: '' + name,
        Surname: '' + lastname,
        PhoneNumber: '' + phone,
        Role: 'Cleaner',
        FacebookLink: ''
    });
    let userLog = new UserLog({
        IP: '' + ipAddress,
        Time: '' + userLogTime,
        Date: '' + userLogTime
    });
    let review = new Review({
        Content: '' + content,
        Title: '' + title,
        Type: '' + type,
        UserName: '' + username
    });
    let completed = new Completed({
        Date: '' + completedDate,
        Time: '' + completedTime,
    });
    let request = new Request({
        Date: '' + requestedDate,
        Time: '' + requestedTime,
    });
    let closed = new Closed({
        CloseBy: '' + closeBy,
        CloseReason: '' + closeReason
    });
    let notification = new Notification({
        RequestTicketUUID: '',
        UserName: ''
    });
    let requestTicket = new RequestTicket({
        Request: request,
        Notification: notification,
        Completed: completed,
        Closed: closed,
        Review: review,
        Origin: origin,
        Destination: destination,
        Status: 'Ongoing',
        Task: '' + task,
        UUID: '' + requestTicketUUID,
        Category: '' + category
    });
    let account = new Account({
        BasicInformation: basicInformation,
        RequestTicket: requestTicket,
        UserLog: userLog,
        AccountStatus: 'Active',
        Location: location,
        OnlineStatus: 'Online',
        Password: '' + password,
        RegisterDate: '' + registerDate,
        SecurityQuestion: 'SecurityQuestion',
        UserName: '' + username,
        UUID: '' + accountUuid
    });
    account.save(function (err, fluffy) {
        if (err)
            return console.error("test Account Model " + err);
    });
    Account.find({}, function (err, res) {
        if (err) {
            return console.error(err);
        }
    }).exec().then(function (doc) {
        console.log("-----account external-----");
        console.log(JSON.stringify({ items: doc }, undefined, '\ '));
        console.log("----------");
    });
}

module.exports = router;
//ACCOUNTS CONTROLLER
'use strict';

module.exports = function(Device) {


	// listProjects
	Device.checkDevice = function(deviceCode, cb) {
		
		Device.findOne({
			where: {
				deviceCode: deviceCode
			}
		}, function(err, result) {
			if (err) return cb(err);

			if (result != null) {		
				cb(null, result)						
			} else {
				// Not exist. 				
				getRandomInviteCode(function(code) {
					var deviceBody = {
						"deviceCode" : deviceCode,
						"inviteCode" : code
					}
					
					Device.create(deviceBody, function(err, result) {
						if (err) return cb(err);	
						cb(null, result)
					});	
				});							
			}			
		});
		
	};

	Device.remoteMethod('checkDevice', {
		accepts: [
		{arg: 'deviceCode', type: 'string', required: true}      
		],
		returns: {arg: 'result', type: 'object'},
		http: {path:'/checkDevice', verb: 'post'}
	});


	// Active invite code
	Device.activeInviteCode = function(id, inviteCode, cb) {
		
		updateReferenceCode(id, inviteCode, function(error, resultReference) {
			if (error) return cb(error);

			countInvitedForOwner(inviteCode, function(error, result) {

				if (error) return cb(error);
				
				cb(null, resultReference)
			})

		})		
	};

	Device.remoteMethod('activeInviteCode', {
		accepts: [	
			{arg: 'id', type: 'string', required: true},
			{arg: 'inviteCode', type: 'string', required: true}			
		],
		returns: {arg: 'result', type: 'object'},
		http: {path:'/activeInviteCode', verb: 'post'}
	});

};

function getRandomInviteCode(cb) {
	
	var randomstring = require("randomstring");
	var app = require('../../server/server');	

	var code = randomstring.generate({
		length: 9,
		charset: 'custom',
		capitalization: 'uppercase'
	});

	checkAvailableInviteCode(code, function(isAvailable) {
		if (isAvailable) {
			
			return cb(code)	
		} else {
			getRandomInviteCode(function(code){
				return cb(code)
			})
			
		}			
	});	
} 

async function checkAvailableInviteCode(code, cb) {	
	var app = require('../../server/server');
	var Device = app.models.Device;
	
	Device.find({
		where: {			
			inviteCode: code
		}		
	}, function(err, result) {		
		if (err) return cb(true);
		
		if (result.length > 0) {			
			return cb(false)
		} else {
			return cb(true)
		}
	});
}

async function updateReferenceCode(id, inviteCode, cb) {
	
	var app = require('../../server/server');
	var Device = app.models.Device;
	Device.findOne({
		where: {
			"id" : id
		}
	}, function(err, result) {
		if (err) return cb(err);

		if (result != null) {
			if (result.referenceCode === "") {
				var device = result;
				device.referenceCode = inviteCode;
				device.save();
				return cb(null, device)	
			} else {
				var error = new Error();
				error.status = 401;
				error.message = "This user already put the invitation code."
				return cb(error);
			}
			
		} else {
			var error = new Error();
			error.status = 401;
			error.message = "There are no datas. You may put wrong the id."
			return cb(error);
		}

	});
}

async function countInvitedForOwner(inviteCode, cb) {
	
	var app = require('../../server/server');
	var Device = app.models.Device;
	Device.findOne({
		where: {
			"inviteCode" : inviteCode
		}
	}, function(err, result) {
		if (err) return cb(err);

		if (result != null) {

			var device = result;
			var currentNumber = device.invitedUsers
			device.invitedUsers = currentNumber + 1;
			device.save();			
			return cb(null, result)
		} else {
			var error = new Error();
			error.status = 401;
			error.message = "There are no datas. You may put wrong the id."
			return cb(error);
		}

	});
}


'use strict';

module.exports = function(Card) {

	var app = require('../../server/server');

	Card.getOneCard = function(deviceId, gameId, cb) {
		
		var CardUsed = app.models.CardUsed;
		CardUsed.find({
			where: {
				deviceId: deviceId,
				gameId: gameId
			}		
		}, function(err, result) {
			if (err) return cb(err);
			
			if (result.length > 0) {				
				var error = new Error();
				error.status = 401;
				error.message = "This device has claimed card for this game.";
				
				return cb(error)
			} else {
				// Not exist. 
				// Start quering card for response & adding card used to CardUsed
				var Device = app.models.Device;
				Device.findOne({
					where: {
						_id: deviceId
					}
				}, function(err, result) {
					if (err) return cb(err);					
					
					if (result != null) {				
						var Game = app.models.Game;
						Game.findOne({
							where: {
								_id: gameId
							}
						}, function(err, result) {
							if (err) return cb(err);					
							
							if (result != null) {				
								Card.findOne({
									where: {
										isUsed: false
									}
								}, function(err, result) {
									if (err) return cb(err);
									if (result == null) {					
										var error = new Error();
										error.status = 401;
										error.message = "There are no cards more."
										return cb(error);
									} else {
										console.log(result)		

										var cardResult = result;
										cardResult.isUsed = true;
										cardResult.save();
										
										var cardId = cardResult.getId();

										var cardUsedBody = {
											"cardId" : cardId,
											"deviceId" : deviceId,
											"gameId" : gameId
										}
										CardUsed.create(cardUsedBody, function(err, result) {
											if (err) return cb(err);	
											cb(null, cardResult)
										});
									}


								});
							} else {
								var error = new Error();
								error.status = 401;
								error.message = "The game id isn't found."
								
								return cb(error)
							}
						});	
					} else {
						var error = new Error();
						error.status = 401;
						error.message = "The device isn't found."
						
						return cb(error)
					}
				});							
			}
		
		});

	};
	Card.remoteMethod('getOneCard', {
		accepts: [
		{arg: 'deviceId', type: 'string', required: true},
		{arg: 'gameId', type: 'string', required: true},
		],
		returns: {arg: 'result', type: 'array'},
		http: {path:'/getOneCard', verb: 'get'}
	});

	Card.beforeRemote('create', function(ctx, unused, next) {
		var error = new Error();
		error.status = 401;
		
		var network = ctx.args.data.network

		if (network === "") {
			error.message = "The 'network' isn't been empty."
			ctx.res.send(error)
		} else if (network === "VINAPHONE" || 
			network === "MOBIPHONE" || 
			network === "VIETTEL") {

			next();

		} else {
			error.message = "The 'network' must be VINAPHONE or MOBIPHONE or VIETTEL."
			ctx.res.send(error)
			
		}
	  	
	});

};

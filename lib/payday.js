var sockFunc = require("../lib/customShit.js");

module.exports = {
	
	processInfo: function(steamID){
		return new Promise(function (fulfill, reject){
		fs.readFile(filename, enc, function (err, res){
			if (err)
				reject(err);
			else
				fulfill(res);
			});
		});
	},
	getAllInfo: function(steamID){
		return new Promise(function (fulfill, reject){
			sockFunc.getPayday(steamID,function(err,payday){
				if(err){
					reject(err);
					return;
				}
				payday = payday.playerstats;
				sockFunc.getGames(steamID, function(err, games){
						if(err){
						reject(err);
						return;
					}
					sockFunc.isShared(steamID, function(err_,isShared){
						if(err_){
							reject(err_);
							return;
						}
						
						sockFunc.getSteamProfile(steamID, function(err__, profile){
							if(err__){
								reject(err__);
								return;
							}
							//wew lad nothing went wrong
							try{
								if(!payday || !payday.stats){
									reject("No statistics were found for this user.");
								}
								var heistSuccess = getStat(payday, "heist_success").value || 0;
								var heistFail = getStat(payday, "heist_failed").value || 0;
								var odSuccess = getStat(payday, "difficulty_sm_wish").value || 0;
								var killCount = 0;
								payday.stats.filter(stat=>stat.name.indexOf("enemy_kills_") > -1).forEach(function(stat, index){
									killCount += stat.value;
								});
							
								fulfill({
									heistSuccess: heistSuccess,
									heistFail: heistFail,
									odSuccess: odSuccess,
									games: games,
									isShared: isShared,
									killCount: killCount,
									payday: payday,
									profile: profile.response.players[0]
								});
							}catch(e){
								reject(e);
							}
							
						});
						
					});
				});
			});
		});
			
	}


}


function getStat(playerstats, stat){
	if(playerstats.stats.filter(s=>s.name.toLowerCase() == stat.toLowerCase()).length > 0){
		return playerstats.stats.filter(s=>s.name.toLowerCase() == stat.toLowerCase())[0];
	}else{
		return {name: null, value: null};
	}
}
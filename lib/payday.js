var sockFunc = require("../lib/customShit.js");
var fs = require('fs');

var weaponFolder = './db/payday/weapons/';
var weaponFiles = fs.readdirSync(weaponFolder);
var weapons = {};

for(i = 0; i < weaponFiles.length; i++){
	var weapon = JSON.parse(fs.readFileSync(weaponFolder + weaponFiles[i], 'utf8'));
	weapons[weapon.name] = weapon;
}

delete weaponFolder;
delete weaponFiles;
delete weapon;
delete i;

var weaponIDs = require("../db/payday/weaponIDs.json");

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
								var heistSuccess = getStat(payday, "heist_success").value || 0;
								var heistFail = getStat(payday, "heist_failed").value || 0;
								var odSuccess = getStat(payday, "difficulty_sm_wish").value || 0;
								var infamy = 0;
								payday.stats.filter(stat=>stat.name.indexOf("player_rank_") > -1).forEach(function(stat, index){
									if(stat.value == 1)
										infamy = parseInt(stat.name.substring(stat.name.lastIndexOf("_") + 1));
								});
								var killCount = 0;
								payday.stats.filter(stat=>stat.name.indexOf("enemy_kills_") > -1).forEach(function(stat, index){
									killCount += stat.value;
								});
								var heistRatio = (typeof (heistSuccess/ heistFail) == "NaN" ? heistSuccess : heistSuccess/ heistFail);
								var heisterID = 0;
								if(getStat(payday, "equipped_character").value < Object.keys(characterList).length)
									heisterID = getStat(payday, "equipped_character").value;
								var heister = {id: Object.keys(characterList)[heisterID].substring(15), name: characterList[Object.keys(characterList)[heisterID]]};
								var primaryGun = weapons[weaponIDs[getStat(payday, "equipped_primary").value-1]];
								var secondaryGun = weapons[weaponIDs[getStat(payday, "equipped_secondary").value-1]];
								primaryGun.kills = getStat(payday, "weapon_kills_" + weaponIDs[getStat(payday, "equipped_primary").value-1]).value;
								secondaryGun.kills = getStat(payday, "weapon_kills_" + weaponIDs[getStat(payday, "equipped_secondary").value-1]).value;
								var level = getStat(payday, "player_level").value;
							
								fulfill({
									heistSuccess: heistSuccess,
									heistFail: heistFail,
									odSuccess: odSuccess,
									infamy: infamy,
									killCount: killCount,
									heistRatio: heistRatio,
									heisterID: heisterID,
									heister: heister,
									primaryGun: primaryGun,
									secondaryGun: secondaryGun,
									games: games,
									isShared: isShared,
									payday: payday,
									profile: profile.response.players[0],
									level: level
							
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

var characterList = {
	"character_used_unknown": "Unknown",
	"character_used_russian": "Dallas",
	"character_used_german": "Wolf",
	"character_used_spanish": "Chains",
	"character_used_american": "Houston",
	"character_used_jowi": "John Wick",
	"character_used_old_hoxton": "Hoxton",
	"character_used_female_1": "Clover",
	"character_used_dragan": "Dragan",
	"character_used_jacket": "Jacket",
	"character_used_bonnie": "Bonnie",
	"character_used_sokol": "Sokol",
	"character_used_dragon": "Jiro",
	"character_used_bodhi": "Bodhi",
	"character_used_jimmy": "Jimmy",
	"character_used_sydney": "Sydney",
	"character_used_wild": "Rust",
	"character_used_chico": "Scarface"
}

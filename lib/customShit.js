var request = require("request");
var auth = require("../config/auth.json");

module.exports = {
	getProfile: function(userID, callback){
		var u = {}
		u.connected_accounts = [];
		if(userID == "182614418343854080"){
			u.connected_accounts.push({type: "steam", "id": "76561198173542555"});
			callback(undefined, u);
			return;
		}
		if(userID == "178521377119141888"){
			u.connected_accounts.push({type: "steam", "id": "76561198050457923"});
			callback(undefined, u);
			return;
		}
		if(userID == "198790061448232960"){
			u.connected_accounts.push({type: "steam", "id": "76561198313509740"});
			callback(undefined, u);
			return;
		}
		if(userID == "233523377451696128"){
			u.connected_accounts.push({type: "steam", "id": "76561198045907938"});
			callback(undefined, u);
			return;
		}
		
		request({
            url: "https://canary.discordapp.com/api/v6/users/" + userID + "/profile",
            headers: {
                'authorization': auth.slave.discord.token
            }
        }, function(err, response, body) {
            try {
                if(err || response.statusCode != 200) {
                    callback(err || response.statusCode);
                    return;
                }

                u = JSON.parse(body);
				callback(undefined, u);
            } catch(e) {
                callback(e);
            }

        });
	}, 
	getPayday: function(steamID, callback){
		request({
            url: "http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=218620&key=" + auth.steam + "&steamid=" + steamID + "&format=json",
        }, function(err, response, body) {
            if(err || response.statusCode != 200) {
              	console.log(err || response.statusCode);
                callback(err || response.statusCode);
                return;
            }
            
            var u = JSON.parse(body);
            if(!u.playerstats){
            	callback(204, null);
            }else{
				callback(undefined, u);
            }

        });
	},
	getGames: function(steamID, callback){
		//http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXX&steamid=YYYYYYYYYYYYYYY&format=json
		request({
		        url: "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + auth.steam + "&steamid=" + steamID + "&format=json",
		    }, function(err, response, body) {
		        if(err || response.statusCode != 200) {
		          	console.log(err || response.statusCode);
		            callback(err || response.statusCode);
		            return;
		        }
		        
		        var u = JSON.parse(body);
		        if(!u.response){
		        	callback(204, null);
		        }else{
					callback(undefined, u);
		        }

		    });
	},
	isShared: function(steamID, callback){
		//http://api.steampowered.com/IPlayerService/IsPlayingSharedGame/v0001/?key=XXXXXXXX&steamid=YYYYYYYYYYY&appid_playing=218620&format=json
		request({
		        url: "http://api.steampowered.com/IPlayerService/IsPlayingSharedGame/v0001/?key=" + auth.steam + "&steamid=" + steamID + "&appid_playing=218620&format=json",
		    }, function(err, response, body) {
		        if(err || response.statusCode != 200) {
		          	console.log(err || response.statusCode);
		            callback(err || response.statusCode);
		            return;
		        }
		        
		        var u = JSON.parse(body);
		        if(!u.response){
		        	callback(204, null);
		        }else{
		        	if(u.response.lender_steamid == "0"){
		        		callback(undefined, false);
		        	}else{
		        		callback(undefined, true);
		        	}
					
		        }

		    });
	},
	getSteamProfile: function(steamID, callback){
		//http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=XXXXXXXXXXXXXX&steamids=YYYYYYYYYYYYYYYY
		request({
		        url: "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + auth.steam + "&steamids=" + steamID + "&format=json",
		    }, function(err, response, body) {
		        if(err || response.statusCode != 200) {
		          	console.log(err || response.statusCode);
		            callback(err || response.statusCode);
		            return;
		        }
		        
		        var u = JSON.parse(body);
		        if(!u.response){
		        	callback(204, null);
		        }else{
		        	callback(null, u);
		        }

		    });
	},
	getAllAchievements: function(callback){
		request({
		        url: "http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key="+ auth.steam + "&appid=218620" + "&format=json",
		    }, function(err, response, body) {
		        if(err || response.statusCode != 200) {
		          	console.log(err || response.statusCode);
		            callback(err || response.statusCode);
		            return;
		        }
		        
		        var u = JSON.parse(body);
		        if(!u.game || !u.game.availableGameStats){
		        	callback(204, null);
		        }else{
		        	callback(null, u.game.availableGameStats.achievements);
		        }

		    });
	}
}

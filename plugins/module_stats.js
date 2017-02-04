var sockFunc = require("../lib/customShit.js");
var payday = require("../lib/payday.js");

var empty = {name: "\u200B", value: "\u200B",inline:true};

module.exports = {
	information : {
		moduleName : "stats"
	},
	cooldown : 10000,
	description : "!stats [user] - Shows the Payday 2 stats for this user.",
	permissions : {
		groups: ["default"]
	},
	aliases: ["tstats"],
	action : function (client, e) {
		e.message.channel.sendTyping();
		
		if(e.message.channel.guild_id == "181079451986165760" && e.message.channel.id != "236570048393773058"){
			e.message.channel.sendMessage("Please use this command in <#236570048393773058>.").then(function(msg){
				setTimeout(function(){if(msg){msg.delete()}}, 15000);
			});
			return;
		}
	
	
		var target = e.message.author;
		var isMention = false;
		if(e.args[0]){
			if (e.args[0] && e.args[0].match(/<@!?([0-9]+)>/) != null) {
				if (e.args[0].match(/<@!?([0-9]+)>/)[1] == parseInt(e.args[0].match(/<@!?([0-9]+)>/)[1])) {
					e.args[0] =  e.args[0].match(/<@!?([0-9]+)>/)[1].toString();
					isMention = true;
				}
			}
			
			if(client.Users.getBy('username', e.args[0]))
				target = client.Users.getBy('username', e.args[0]);
			if(client.Users.getBy('id', e.args[0]))
				target = client.Users.getBy('id', e.args[0]);
			if(isMention && !client.Users.getBy('id', e.args[0])){
				e.message.channel.sendMessage("That user was not found.");
				return;
			}
			
			
		}
		if(typeof target != "object"){
			e.message.channel.sendMessage("That user was not found.");
			return;
		}
		sockFunc.getProfile(target.id, function(err, res){
			if(err || res.code){
				e.message.channel.sendMessage("Something went wrong. This is probable due to the bot not being setup correctly on this server.\n\nHave a server administrator contact <@132842210231189504>");
				return;
			}
			
			
			if(res.connected_accounts && res.connected_accounts.filter(acc => acc.type == "steam").length > 0){
				var steamAccount = res.connected_accounts.filter(acc => acc.type == "steam")[0].id;
				
					payday.getAllInfo(steamAccount).then(function(info){
						try{
							games = info.games.response.games;
							var playtime = ""
							if(!info.isShared){
								if(games.filter(g=>g.appid == 218620)[0]){
									playtime = numberWithCommas(Math.floor(games.filter(g=>g.appid == 218620)[0].playtime_forever / 60)) + " hours";
									if(games.filter(g=>g.appid == 218620)[0].playtime_forever % 60 > 0){
										playtime += " and " + Math.floor(games.filter(g=>g.appid == 218620)[0].playtime_forever % 60) + " minutes"
									}
								}else{
									playtime = "0 hours"
								}
							}
					
							
							e.message.channel.sendMessage("", false, {
							  color: 0x3498db,
							  author: {name: "Stats for " + info.profile.personaname, icon_url: info.profile.avatarmedium, url: "https://steamcommunity.com/profiles/" + info.profile.steamid},
							  timestamp: (new Date().toISOString()),
							  footer: {text: "Requested by " + e.message.author.username},
							  fields: [
							  
								{name: (info.isShared ? "👪Family Shared" : "🕙Total Playtime"), value: (info.isShared ? "\u200B" : playtime), inline: true},
								{name: "🏆Achievements", value: numberWithCommas(info.payday.achievements.length), inline: true},
								{name: "🥇Level", value: (info.infamy > 0 ? "**\\\u2660**" + infamyList[info.infamy-1] + "-" : "") + info.level, inline: true},
						
						
							  	{name: "☠Total Kills", value: numberWithCommas(info.killCount), inline: true},
							  	{name: "💰Heists Completed", value: numberWithCommas(info.heistSuccess + info.heistFail), inline: true},
							  	{name: "🤡Heister", value: info.heister.name, inline: true},
								  
								  
								{name: "🔫Primary Weapon", value: info.primaryGun.MarketName + " (" + info.primaryGun.kills + ")", inline: true},
								empty,
								{name: "🔫Secondary Gun", value: info.secondaryGun.MarketName + " (" + info.secondaryGun.kills + ")", inline: true}
							  ]
							});
							
						}catch(e_){
							e.message.channel.sendMessage("Something went wrong");
							console.log(e_);
							return;
						}
					},function(err){
						switch(err){
							case 503:
								e.message.channel.sendMessage("Looks like Steam is down, please try again later!");
								break;
							case 500:
								e.message.channel.sendMessage(target.username + " does not have their Steam Profile set to public.");
								break;
							case 204:
								e.message.channel.sendMessage("No stats were found for " + target.username);
								break;
							case 400:
								e.message.channel.sendMessage(target.username + " doesn't own Payday 2!");
								break;
							case 404:
								e.message.channel.sendMessage("Profile not found.");
								break;
							default: 
								e.message.channel.sendMessage("Something went wrong. (Error " + err + ")");
								break;
						}
					});
			}else{
				//e.message.reply("I am currently experiencing some issues, please stand by.");
				e.message.reply(target.username + " does not have their Steam account connected to Discord.\nMake sure 'Display on profile' is checked!");
			}
			//e.message.channel.sendMessage("```js\n" + JSON.stringify(res,null,4) + "```");
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

function numberWithCommas(x) {
	if(!x)
		return "0";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var infamyList = ["I", "II", "III", "IV", "V", "VI", 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV'];


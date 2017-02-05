var sockFunc = require("../lib/customShit.js");
var fs = require('fs');
var http = require("follow-redirects").http;

var secondaryList = require("../db/secondary.json");
var primaryList = require("../db/primary.json");

var weaponIDs = require("../db/weaponIDs.json");
var enemies = require("../db/enemies.json");


module.exports = {
	information : {
		moduleName : "kills",
		description : "!kills [user] - Shows the amount of kills for each unit"
	},
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
				e.message.channel.sendMessage("Something went wrong. (1)");
				return;
			}
			
			
			if(res.connected_accounts.filter(acc => acc.type == "steam").length > 0){
				var steamAccount = res.connected_accounts.filter(acc => acc.type == "steam")[0].id;
				
				
				sockFunc.getPayday(steamAccount,function(err,payday){
					if(err){
						switch(err){
							case 500:
								e.message.channel.sendMessage(target.username + " does not have their Steam Profile set to public.");
								break;
							case 204:
								e.message.channel.sendMessage("No stats were found for " + target.username);
								break;
							case 400:
								e.message.channel.sendMessage(target.username + " doesn't own Payday 2!");
								break;
							default: 
								e.message.channel.sendMessage("Something went wrong. (Error " + err + ")");
								break;
						}
						
						return;
					}
					payday = payday.playerstats;
					sockFunc.getSteamProfile(steamAccount, function(err__, profile){
						try{
							if(err__){
								e.message.channel.sendMessage("An error occured.");
								return;
							}
							
							var killCount = 0;
							var kills_ = [];
							payday.stats.filter(stat=>stat.name.indexOf("enemy_kills_") > -1).forEach(function(stat, index){
								killCount += stat.value;
								kills_.push([enemies[stat.name.substring(12)], stat.value]);
							});
							
							kills_.sort(function(a,b){return ((a[1] > b[1]) ? -1 : ((a[1] < b[1]) ? 1 : 0))})
							kills = kills_.splice(0,10);
							var others = kills_.length;
							var otherKills = 0;
							
							kills_.forEach(function(item){
								otherKills += item[1];
							});
							
							var killText = "**Total Kills: **" + numberWithCommas(killCount) + "\n\n";
							
							kills.forEach(function(item){
								if(item)
									killText += "**" + item[0] + "**: " + numberWithCommas(item[1]) + "\n";
							});
							
							e.message.channel.sendMessage(killText + "*and " + others + " others: " + otherKills + "*");
							
							
							
								
						}catch(e_){
							e.message.channel.sendMessage("```js\n" + e_ + "```")
						}
						
					});
					
					
				});
			}else{
				e.message.reply(target.username + " does not have their Steam account connected to Discord.\nMake sure 'Display on profile' is checked!");
			}
			//e.message.channel.sendMessage("```js\n" + JSON.stringify(res,null,4) + "```");
		});
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

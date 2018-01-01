var sockFunc = require("../lib/customShit.js");
var payday = require("../lib/payday.js");
var cheerio = require("cheerio");
var request = require("request");
var empty = {name: "\u200B", value: "\u200B",inline:true};

module.exports = {
	information : {
		moduleName : "stats",
		description : "!stats [user] - Shows the Payday 2 stats for this user."
	},
	action : function (client, e, logger) {
		
		if(e.message.channel.guild_id == "181079451986165760" && e.message.channel.id != "236570048393773058"){
			e.message.channel.sendMessage("Please use this command in <#236570048393773058>.").then(function(msg){
				setTimeout(function(){if(msg){msg.delete()}}, 10000);
			});
			return;
		}
	
	
		var target;
		var isMention = false;
		if(e.args[0]){
			e.args[0] = e.args.join(" ");
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
			if(e.args[0].indexOf("http://steamcommunity.com/profiles/") == 0)
				target = {skip: true, steamID: e.args[0].substring(35)};
			
			if(!target){
				e.message.channel.sendMessage("That user was not found.");
				return;
			}
		}else{
			target = e.message.author;
		}

		if(target.bot){
			e.message.channel.sendMessage("Bot users don't have stats!");
			return;
		}
		e.message.channel.sendTyping();



		sockFunc.getProfile(target.id, function(err, res){
			if(err || res.code){
				e.message.channel.sendMessage("Something went wrong. This is probable due to the bot not being setup correctly on this server.\n\nHave a server administrator contact <@132842210231189504> (`TheEvilSocks#0023`)");
				logger.error(err || res.code);
				return;
			}

			if(res.connected_accounts && res.connected_accounts.filter(acc => acc.type == "steam").length > 0){
				var steamAccount = res.connected_accounts.filter(acc => acc.type == "steam")[0].id;
				

					payday.getAllInfo(steamAccount).then(info => {
						var games = info.games.response.games;
						if(!games){

						}

						request.post({
							url: "http://fbi.overkillsoftware.com/datafeed/datafeed-modusoperandi.php",
							form: {
								steamid: steamAccount
							},
							timeout: 5000
						}, function(err, response, body) {
							if(err || response.statusCode != 200) {
								if(err && err.code == "ESOCKETTIMEDOUT"){
									e.message.channel.sendMessage("Looks like the FBI systems are a bit slow, you should try again later.");
									return;
								}
								e.message.channel.sendMessage("Uh, looks like the FBI is having some problems.");
								logger.error(err || response.statusCode);
								return;
							}
							$ = cheerio.load(body);


							var title = $('.fbiwindowcontentboxcolumninnertitle')[0].innerText;

							if(title == "Unknown Person"){
								e.message.channel.sendMessage("This person cannot be found in the FedNet Database. The Database may also be experiencing issues.");
								return;
							}
							if(title == "Not known to the FBI"){
								e.message.channel.sendMessage("This person does not have a known criminal history, and has no information in the FedNet Database.");
								return;
							}

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

							var steamName = $('.fbiwindowcontentboxinnertitle1')[0].innerText;
							var heisterName = $('.fbimodusappearanceclick')[0].attribs.onclick.toString().substring(nthIndex($('.fbimodusappearanceclick')[0].attribs.onclick.toString(), '\'', 3)+1).substring(0,$('.fbimodusappearanceclick')[0].attribs.onclick.toString().substring(nthIndex($('.fbimodusappearanceclick')[0].attribs.onclick.toString(), '\'', 3)+1).length-3);

							var level = $('.fbimoduslevelcontainernumber')[0].children[0].data;
							var infamy = $('.fbimoduslevelcontainernumber')[1].children[0].data;

							var primaryWeapon = $('.fbimodusequipclickable')[0].attribs.onclick.toString().substring(nthIndex($('.fbimodusequipclickable')[0].attribs.onclick.toString(), '\'', 3)+1).substring(0,$('.fbimodusequipclickable')[0].attribs.onclick.toString().substring(nthIndex($('.fbimodusequipclickable')[0].attribs.onclick.toString(), '\'', 3)+1).length-3);
							var secondaryWeapon = $('.fbimodusequipclickable')[1].attribs.onclick.toString().substring(nthIndex($('.fbimodusequipclickable')[1].attribs.onclick.toString(), '\'', 3)+1).substring(0,$('.fbimodusequipclickable')[1].attribs.onclick.toString().substring(nthIndex($('.fbimodusequipclickable')[1].attribs.onclick.toString(), '\'', 3)+1).length-3);
							var meleeWeapon = $('.fbimodusequipclickable')[2].attribs.onclick.toString().substring(nthIndex($('.fbimodusequipclickable')[2].attribs.onclick.toString(), '\'', 3)+1).substring(0,$('.fbimodusequipclickable')[2].attribs.onclick.toString().substring(nthIndex($('.fbimodusequipclickable')[2].attribs.onclick.toString(), '\'', 3)+1).length-3);
							var throwableWeapon = $('.fbimodusequipclickable')[3].attribs.onclick.toString().substring(nthIndex($('.fbimodusequipclickable')[3].attribs.onclick.toString(), '\'', 3)+1).substring(0,$('.fbimodusequipclickable')[3].attribs.onclick.toString().substring(nthIndex($('.fbimodusequipclickable')[3].attribs.onclick.toString(), '\'', 3)+1).length-3);



							e.message.channel.sendMessage("", false, {
								color: parseInt(e.mastergroup.colour),
								author: {name: "Stats for " + info.profile.personaname, icon_url: info.profile.avatarmedium, url: "https://steamcommunity.com/profiles/" + info.profile.steamid},
								timestamp: (new Date().toISOString()),
								footer: {text: "Requested by " + e.message.author.username},
								fields: [

									{name: (info.isShared ? "👪Family Shared" : "🕙Total Playtime"), value: (info.isShared ? "\u200B" : playtime), inline: true},
									{name: "🏆Achievements", value: (info.payday.achievements ? numberWithCommas(info.payday.achievements.length) : 0), inline: true},
									{name: "🥇Level", value: (infamy != "0" ? "**\\\u2660**" + infamy + "-" : "") + level, inline: true},


									{name: "☠Total Kills", value: numberWithCommas(info.killCount), inline: true},
									{name: "💰Heists Completed", value: numberWithCommas(info.heistSuccess + info.heistFail), inline: true},
									{name: "🤡Heister", value: heisterName, inline: true},
								  
								  
									{name: "🔫Primary Weapon", value: primaryWeapon, inline: true},
									{name: "🔫Secondary Weapon", value: secondaryWeapon, inline: true},
									{name: "🗡Melee Weapon", value: meleeWeapon, inline: true}
								]
							});


						});
					});
					
			}else{
				e.message.reply(target.username + " does not have their Steam account connected to Discord.\nMake sure 'Display on profile' is checked!");
			}
		});
	}
}

function nthIndex(str, pat, n){
	var L= str.length, i= -1;
	while(n-- && i++<L){
		i= str.indexOf(pat, i);
		if (i < 0) break;
	}
	return i;
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


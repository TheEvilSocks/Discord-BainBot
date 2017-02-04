var sockFunc = require("../lib/customShit.js");


var allWeapons = require("../db/allWeapons.json");
var weaponIDs = require("../db/weaponIDs.json");


module.exports = {
	information : {
		moduleName : "weapon"
	},
	cooldown : 1000,
	description : "!weapon <weapon> - Shows information about a weapon",
	permissions : {
		groups: ["default"]
	},
	action : function (client, e) {
		if(!e.args[0]){
			e.message.reply("**USAGE:**\n`" + module.exports.description + "`");
			return;
		}
		e.args[0] = e.args.join(" ");
		if(e.args[0].length < 3){
			e.message.reply("please enter at least 3 characters.");
			return;
		}
		
		
		var found = allWeapons.filter(function(obj){
			return obj.Name.toLowerCase() == e.args[0].toLowerCase() || obj.MarketName.toLowerCase() == e.args[0].toLowerCase() || obj.Wiki.toLowerCase() == e.args[0].toLowerCase() || obj.Image.toLowerCase() == e.args[0].toLowerCase() || obj.VarN.toLowerCase() == e.args[0].toLowerCase()
		});
		
		console.log(found);
		if(found.length == 0)
			found = allWeapons.filter(function(obj){
				return obj.MarketName.toLowerCase().indexOf(e.args[0].toLowerCase()) > -1;
			});
		
		if(found.length == 0){
			e.message.channel.sendMessage("Sorry, I couldn't find the weapon you meant.");
			return;
		}
		
		if(found.length == 1){
			var statsText = "";
			for(i=0;i<Object.keys(found[0].Stats).length;i++){
				if(Object.keys(found[0].Stats)[i] != "slot")
					statsText += "• " + Object.keys(found[0].Stats)[i] + ": " + found[0].Stats[Object.keys(found[0].Stats)[i]] + "\n"
			}
			var wikiText=  "";
			if(found[0].Wiki){
				wikiText = "**Wiki:** <http://payday.wikia.com/wiki/" + found[0].Wiki + ">\n"
			}
			e.message.channel.sendMessage("**" + found[0].MarketName + "**\n"+ wikiText+ "**STATS:**\n" + statsText);
			return;
		}
		
		var foundText = "";
		for(i=0;i<found.length;i++){
			foundText += "• " + found[i].Name + " (" + found[i].MarketName + ")" + "\n"
		}
		e.message.channel.sendMessage("I found multiple matches to your search!\n" + foundText)
		
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


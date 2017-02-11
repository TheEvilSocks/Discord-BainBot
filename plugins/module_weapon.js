var sockFunc = require("../lib/customShit.js");
var fs = require('fs');

var weaponFolder = './db/payday/weapons/';
var weaponFiles = fs.readdirSync(weaponFolder);
var weapons = {};

module.exports = {
	information : {
		moduleName : "weapon",
		description : "!weapon <weapon> - Shows information about a weapon"
	},
	action : function (client, e) {
		if(!e.args[0]){
			e.message.reply("**USAGE:**\n`" + module.exports.information.description + "`");
			return;
		}
		e.args[0] = e.args.join(" ");
		if(e.args[0].length < 3){
			e.message.reply("please enter at least 3 characters.");
			return;
		}

		var found = [];
		for(var i = 0; i < Object.keys(weapons).length; i++){
			var obj = weapons[Object.keys(weapons)[i]];
			if(obj.name.toLowerCase() == e.args[0].toLowerCase() || obj.fullName.toLowerCase() == e.args[0].toLowerCase() || obj.wikiName.toLowerCase() == e.args[0].toLowerCase() || obj.image.toLowerCase() == e.args[0].toLowerCase())
				found.push(obj);
		}
		
		if(found.length == 0)
			for(var i = 0; i < Object.keys(weapons).length; i++){
				var obj = weapons[Object.keys(weapons)[i]];
				if( obj.fullName.toLowerCase().indexOf(e.args[0].toLowerCase()) > -1)
					found.push(obj);
			};
		
		if(found.length == 0){
			e.message.channel.sendMessage("Sorry, I couldn't find the weapon you meant.");
			return;
		}
		
		if(found.length == 1){
			var statsText = "";
			for(i=0;i<Object.keys(found[0].stats).length;i++){
				statsText += "• " + capitalize(Object.keys(found[0].stats)[i]) + ": " + found[0].stats[Object.keys(found[0].stats)[i]] + "\n"
			}
			var wikiText=  "";
			if(found[0].wikiName){
				wikiText = "**Wiki:** <http://payday.wikia.com/wiki/" + found[0].wikiName + ">\n"
			}
			e.message.channel.sendMessage("**" + found[0].fullName + "**\n"+ wikiText + "**STATS:**\n" + statsText);
			return;
		}
		
		var foundText = "";
		for(i=0;i<found.length;i++){
			foundText += "• " + found[i].name + " (" + found[i].fullName + ")" + "\n"
		}
		e.message.channel.sendMessage("I found multiple matches to your search!\n" + foundText)
		
	},
	reload: function(){
		module.exports.initialize();
	},
	initialize: function(){
		for(i = 0; i < weaponFiles.length; i++){
			var weapon = JSON.parse(fs.readFileSync(weaponFolder + weaponFiles[i], 'utf8'));
			weapons[weapon.name] = weapon;
		}

		delete weaponFolder;
		delete weaponFiles;
		delete weapon;
		delete i;
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function capitalize(str){
	return str.substring(0,1).toUpperCase() + str.substring(1);
}
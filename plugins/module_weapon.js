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
			if(obj.name.toLowerCase() == e.args[0].toLowerCase() || obj.fullName.toLowerCase() == e.args[0].toLowerCase() || obj.image.toLowerCase() == e.args[0].toLowerCase())
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

			var fields = [];

			if(found[0].cost)
				fields.push({name: "Cost",value: found[0].cost});
			fields.push({name: "__STATS__",value: "\u200B"});

			for(let i = 0; i < Object.keys(found[0].stats).length; i++){
				fields.push({
					name: capitalize(Object.keys(found[0].stats)[i]),
					value: found[0].stats[Object.keys(found[0].stats)[i]].toString(),
					inline:true
				});
			}

			var embed = {
				title: found[0].fullName,
				fields: fields,
				image: {
					url: "http://fbi.overkillsoftware.com/img/weapons/ranged/thumbs/" + found[0].image + ".png" 
				}
			};
			console.log(embed);
			e.message.channel.sendMessage("", false, embed);

			return
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
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function capitalize(str){
	return str.substring(0,1).toUpperCase() + str.substring(1);
}
var sockFunc = require("../lib/customShit.js");

module.exports = {
	information : {
		moduleName : "achievement",
		description : "!achievement <achievement> - Shows information about an achievement"
	},
	action : function (client, e) {
		e.args[0] = e.args.join(" ");
		if(!e.args[0]){
			e.message.reply("**USAGE:**\n`" + module.exports.information.description + "`");
			return;
		}
		if(e.args[0].length < 3){
			e.message.reply("please enter at least 3 characters.");
			return;
		}

		sockFunc.getAllAchievements((err, achievements) => {
			if(err){
				e.message.channel.sendMessage("Couldn't get the achievements from Steam.");
				return;
			}
			var found = [];
			found = achievements.filter(achiev => achiev.name.toLowerCase() == e.args[0].toLowerCase());

			if(found.length == 0)
				found = achievements.filter(achiev => achiev.displayName.toLowerCase() == e.args[0].toLowerCase());
			if(found.length == 0)
				found = achievements.filter(achiev => achiev.displayName.toLowerCase().indexOf(e.args[0].toLowerCase()) > -1);
			if(found.length == 0)
				found = achievements.filter(achiev => achiev.description.toLowerCase().indexOf(e.args[0].toLowerCase()) > -1);


			if(found.length == 0){
				e.message.channel.sendMessage("Sorry, I couldn't find the achievement you meant.");
				return;
			}

			if(found.length > 1){
				var foundText = "";
				for(let i = 0; i < found.length; i++){
					foundText += "• " + found[i].displayName + " (`" + found[i].name + "`)" + "\n"
				}
				e.message.channel.sendMessage("I found multiple matches to your search!\n" + foundText);
				return;
			}

			e.message.channel.sendMessage("", false, {
				title: found[0].displayName,
				description: found[0].description,
				thumbnail: {
					url: found[0].icon
				}
			});


		});	
	}
}
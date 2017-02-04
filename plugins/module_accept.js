var suggestions = require('../db/suggestions.json');
var fs = require("fs");

module.exports = {
	information : {
		moduleName : "accept"
	},
	lastTime : 0,
	cooldown : 3000,
	hide: true,
	description : "!accept <suggestion> <Information> - Suggest a feature",
	permissions : {
		groups: ["root"]
	},
	action : function (client, e) {
		e.args[1] = e.args.splice(1).join(" ");
		
		if(!e.args[0] || !e.args[1]){
			e.message.reply("**USAGE:**\n`" + module.exports.description + "`");
			return;
		}
		
		if(!suggestions[e.args[0]]){
			e.message.reply("That suggestion does not exist.");
			return;
		}
		
		var suggestion = suggestions[e.args[0]];
		if(client.Users.get(suggestion.author)){
			client.Users.get(suggestion.author).openDM().then(function(chan){
				chan.sendMessage("Your suggestion has been accepted!\n\n**Additional Comment:**\n```text\n" + e.args[1] + "```\n\n**Suggestion**\n`" + suggestions[e.args[0]].suggestion + "`");
				
				e.message.reply("Accepted suggestion!");
				client.Messages.deleteMessage(suggestions[e.args[0]].msgID, '238761417048588299');
				
				delete suggestions[e.args[0]];
				fs.writeFile('./db/suggestions.json', JSON.stringify(suggestions));
				
				
				e.message.delete();
				
			});
			
		}else{
			e.message.reply("Cannot contact author.");
		}
		
		
	}
}

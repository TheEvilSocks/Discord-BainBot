var suggestions = require('../db/suggestions.json');
var fs = require("fs");

module.exports = {
	information : {
		moduleName : "suggest"
	},
	lastTime : 0,
	cooldown : 3000,
	description : "!suggest <suggestion> - Suggest a feature",
	permissions : {},
	action : function (client, e) {
		e.args[0] = e.args.join(" ");
		
		if(!e.args[0] || e.args[0] == ""){
			e.message.reply("**USAGE:**\n`" + module.exports.description + "`");
			return;
		}
		
		client.Channels.get("238761417048588299").sendMessage("**Suggestion by `" + e.message.author.username + "#" + e.message.author.discriminator + "`**\n**ID:** `" + e.message.id + "`\n```text\n" + e.args[0] + "```").then(function(msg){
			e.message.reply("You suggestion has been listed. You will be notified once it's been accepted.");
			suggestions[e.message.id] = {author: e.message.author.id, suggestion: e.args[0], msgID: msg.id}
			fs.writeFile('./db/suggestions.json', JSON.stringify(suggestions));
		});;
		
	}
}

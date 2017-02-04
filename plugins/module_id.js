module.exports = {
	information : {
		moduleName : "id"
	},
	lastTime : 0,
	cooldown : 3000,
	description : "!id - Show your Discord ID",
	permissions : {},
	action : function (client, e) {
		if(e.message.channel.is_private){
			e.message.channel.sendMessage("Your Discord ID is: **" + e.message.author.id + "**");
		}
	}
}

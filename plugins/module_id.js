module.exports = {
	information : {
		moduleName : "id",
		description : "!id - Show your Discord ID",
	},
	action : function (client, e) {
		if(e.message.channel.is_private)
			e.message.channel.sendMessage("Your Discord ID is: **" + e.message.author.id + "**");
	}
}

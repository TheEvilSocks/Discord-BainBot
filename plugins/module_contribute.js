module.exports = {
	information : {
		moduleName : "contribute"
	},
	lastTime : 0,
	cooldown : 3000,
	description : "!contribute - Some information on how to contribute to Bain",
	permissions : {},
	action : function (client, e) {
		e.message.channel.sendMessage("First of all, thank you for considering helping out in the development of Bain!\n" + 
								"Payday constantly changes, thus this bot is constantly in development. Doing this alone is a hard job, but you can help!\n" +
								"Below you can find a link where you can help keep information up to date.\n" +
								"Please also report any bugs you find there using the issue tracker.\n\n" +
								"Your Discord ID is: **" + e.message.author.id + "**\n\n" +
								"https://github.com/TheEvilSocks/Discord-Bain");
	}
}

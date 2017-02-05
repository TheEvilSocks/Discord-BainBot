module.exports = {
	information : {
		moduleName : "ping",
		description : "ping - Pong!"
	},
	action : function (client, e) {
		var pingBegin = new Date();
		e.message.channel.sendMessage("Pong!").then(function (info) {
			info.edit("Pong!\nDelay: " + (new Date().getTime() - pingBegin.getTime()) + "ms");
		});
	}
}

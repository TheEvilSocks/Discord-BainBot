var os = require('os');
var fs = require('fs');


module.exports = {
	information : {
		moduleName : "debug"
	},
	lastTime : 0,
	cooldown : 500,
	description : "debug - Shows debug information about the bot",
	permissions : {
		groups : ["root"]
	},
	hide: true,
	action : function (client, e) {
		var mem = process.memoryUsage();
		var memUsage = (mem.heapUsed / (1024 * 1024)).toFixed(2) + " MB / " + (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + " GB";

		var t = Math.floor(process.uptime() * 1000);
		var uptime = "";
		var M,
		w,
		d,
		h,
		m,
		s;
		s = Math.floor(t / 1000);
		m = Math.floor(s / 60);
		s = s % 60;
		h = Math.floor(m / 60);
		m = m % 60;
		d = Math.floor(h / 24);
		h = h % 24;
		w = Math.floor(d / 7);
		d = d % 7;
		M = Math.floor(w / 4);
		w = w % 4;

		M != 0 ? uptime += M + (M > 1 ? " months, " : " month, ") : null;
		w != 0 ? uptime += w + (w > 1 ? " weeks, " : " week, ") : null;
		d != 0 ? uptime += d + (d > 1 ? " days, " : " day, ") : null;
		h != 0 ? uptime += h + (h > 1 ? " hours, " : " hour, ") : null;
		m != 0 ? uptime += m + (m > 1 ? " minutes, " : " minute, ") : null;
		s != 0 ? uptime += s + (s > 1 ? " seconds, " : " second, ") : null;
		var commandFiles = fs.readdirSync("./node_modules/");
		e.message.channel.sendMessage("**DEBUG INFORMATION**\n```xl\n" +
			"Node version:          " + process.release.name + " " + process.version.toString() +
			"\nPlatform:              " + process.platform + " " + process.config.variables.host_arch +
			"\nProcess ID:            " + process.pid +
			"\nUptime:                " + uptime.substring(0, uptime.length - 2) +
			"\nMemory Usage:          " + memUsage +
			"\n-----" +
			"\nServers:               " + client.Guilds.length +
			"\nChannels:              " + client.Channels.length +
			"\nOnline Users:          " + client.Users.length +
			"\nMessages seen:         " + client.Messages.length +
			"\nCommands executed:     " + e.GLOBAL.GLOBAL.commands +
			"\n-----" +
			"\nCommands loaded:       " + Object.keys(e.GLOBAL.commands).length + 
			"\nNode modules loaded:   " + commandFiles.length + 
			

			"```")
	}
}

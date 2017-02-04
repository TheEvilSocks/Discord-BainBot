process.chdir('../pd2');

var auth = require("./config/auth.json");
var config = require("./config/config.json");
var userDB = require("./db/users.json");

var fs = require("fs");

var ncp = require("ncp").ncp;
var CronJob = require('cron').CronJob;
var winston = require("winston");
var http = require("follow-redirects").http;
var slave = require("./lib/slave.js");

/*-----------------------------------------------*/
/* CRON JOBS */
var dbBackupJob = new CronJob({
		cronTime : '*/30 * * * *',
		onTick : function () {
		makeBackup();
	},
	start : true,
	timeZone : 'Europe/Amsterdam'
});



/*-----------------------------------------------*/



var GLOBAL = {
	commands : 0,
	lastBanWarn: {}
};
winston.add(winston.transports.File, {
	level : 'debug',
	filename : "logs.txt"
});
winston.remove(winston.transports.Console);
var winstonLevels = {
	levels : {
		stats: 0,
		info : 1,
		error : 1,
		warn : 1
	},
	colors : {
		stats: 'blue',
		info : 'green',
		error : 'red',
		warn : 'yellow'
	}
};

var logger = new(winston.Logger)({
	levels : winstonLevels.levels,
	transports : [
		new(winston.transports.Console)({
			colorize : 'all'
		})
	]
});

winston.addColors(winstonLevels.colors);

winston.level = 'debug';

var startTime = new Date();
var Discordie = require("discordie");
var Events = Discordie.Events;
var client = new Discordie();

var commands = {
	eval : {
		hide: true,
		cooldown : 500,
		description : "eval <code> - Evaluate your code",
		permissions : {
			groups: ["root"]
		},
		action : function (client, e) {
			if (e.message.author.id == config.bot.master) {
				var beforeEval = new Date();
				try {
					var theEval = eval(e.args.join(" "));
					e.message.channel.sendMessage("**INPUT**\n```javascript\n" + e.args.join(" ") + "```\n**OUTPUT**\n```javascript\n" + theEval + "```\n`Executed in: " + (new Date().getTime() - beforeEval.getTime()).toString() + "ms`");
				} catch (err) {
					e.message.channel.sendMessage("**INPUT**\n```javascript\n" + e.args.join(" ") + "```\n**OUTPUT**\n```diff\n-" + err.message + "```\n`Executed in: " + (new Date().getTime() - beforeEval.getTime()).toString() + "ms`");
					//e.message.channel.sendMessage("```xl\ninput: " + e.message.content.split(" ").splice(2).join(" ") + "\noutput: " + err.message + "\nexecuted in: " + (new Date().getTime() - beforeEval.getTime()).toString() + "ms```");
				}

				return;
			} else {
				e.message.reply("only <@" + config.bot.master + "> can use this command!")
			}
		}
	},
	reload : {
		hide: true,
		cooldown : 500,
		description : "reload <command> - Reload a command",
		permissions : {
			groups : ["root"]
		},
		action : function (client, e) {
			if(!e.args[0]){
				e.message.channel.sendMessage("**USAGE:**\n`" + commands.reload.description + "`");
				return;
			}
			var beforeReload = new Date();
			try{
				if(require.resolve("./plugins/module_" + e.args[0].toLowerCase() + ".js")){
					var location = require.resolve("./plugins/module_" + e.args[0].toLowerCase() + ".js");
					delete require.cache[location]; 
					loadModule(e.args[0], "./plugins/module_" + e.args[0] + ".js");
					e.message.channel.sendMessage("Successfully reloaded `" + e.args[0].toLowerCase() + "`!\nTook: " + ((new Date()).getTime() - beforeReload) + "ms");
				}else{
					e.message.reply("Cache not found. Reloading failed.");
				}
			}catch(e_){
				e.message.channel.sendMessage("Reloading failed ```javascript\n" + e_ + "```");
			}
		}
	},
	load : {
		hide: true,
		cooldown : 500,
		description : "load <command> - Load a new command",
		permissions : {
			groups : ["root"]
		},
		action : function (client, e) {
			if(!e.args[0]){
				e.message.channel.sendMessage("**USAGE:**\n`" + commands.reload.description + "`");
				return;
			}
			var beforeReload = new Date();
			try{
				loadModule(e.args[0].toLowerCase(), "./plugins/" + e.args[0].toLowerCase());
				commands[e.args[0].toLowerCase()] = require("./plugins/module_" + e.args[0].toLowerCase() + ".js")
				e.message.channel.sendMessage("Successfully loaded `" + e.args[0].toLowerCase() + "`!\nTook: " + ((new Date()).getTime() - beforeReload) + "ms");
			}catch(e_){
				e.message.channel.sendMessage("Loading failed ```javascript\n" + e_ + "```");
			}
		}
	}

};

client.connect({
	token : auth.discord.token
});

client.Dispatcher.on(Events.GATEWAY_READY, function (e) {
	logger.info("Connected as: " + client.User.username);
	logger.info("Took " + (new Date().getTime() - startTime.getTime()) + "ms");
	
});



client.Dispatcher.on(Events.MESSAGE_CREATE, function (e) {
	processNewMessage(e);
});

function processNewMessage(e) {
	if(!e.message.content.startsWith(config.bot.prefix))
		return;

	
	var passedMessage = e.message.content.substring(1).split(" ");
	
	if(!commands[passedMessage[0]])
		return;

	if(!userDB[e.message.author.id]){
		userDB[e.message.author.id] = {
			'groups':['default']
		}
		fs.writeFile("db/users.json", JSON.stringify(userDB).replace(/`/g, '\u200B`'));
	}
	var user = client.Users.get( e.message.author.id);
	var channel = client.Channels.get(e.message.channel_id);
	if (channel && !channel.is_private) {
		var guild = client.Guilds.getBy("id", channel.guild_id);
	} else {
		var guild = {
			name : "PM"
		};
		channel = {
			name : "PM"
		};
	}
	logger.info("----------------");
	logger.info("[" + new Date().toLocaleDateString("nl-NL") + " " + new Date().toLocaleTimeString("en-GB", {
		hour12 : false
	}) + "] | [" + guild.name + "][#" + channel.name + "] <" + e.message.author.username + " (" + e.message.author.id + ")>\n" + e.message.content + (e.message.attachments.length > 0 ? "\n[Attachments: " + e.message.attachments.length + "]" : ""));

	if (e.message.author.id == client.User.id)
		return;
	
	e.args = passedMessage.splice(1);

	if (commands[passedMessage[0]]) {
		if(isInGroup(user.id, 'banned')){
			if(!GLOBAL.lastBanWarn[user.id])
				GLOBAL.lastBanWarn[user.id] = 0;
			if(GLOBAL.lastBanWarn[user.id] < ((new Date()).getTime() - 60000)){
				e.message.reply("you're banned from using this bot.");
				GLOBAL.lastBanWarn[user.id] = (new Date()).getTime();
			}
			return;	
		}
		var command = commands[passedMessage[0]];
		
		if(!command.cooldowns){
			command.cooldowns = {};
		}
		if(!command.cooldowns[e.message.author.id]){
			command.cooldowns[e.message.author.id] = 0;
		}
	
		if((command.cooldowns[e.message.author.id] + command.cooldown <= (new Date()).getTime()) || isInGroup(e.message.author.id, 'root')){
			if (command.permissions) {
				if (command.permissions.groups) {
					for (i = 0; i < command.permissions.groups.length; i++) {
						if (isInGroup(e.message.author.id, command.permissions.groups[i])) {
							executeCommand(command, e, user)
							return;
						}
					}

				} else {
					executeCommand(command, e, user)
					return;
				}
			} else {
				executeCommand(command, e, user)
				return;
			}
		}else{
			e.message.reply("please wait " + parseFloat(((command.cooldowns[e.message.author.id] + command.cooldown)-(new Date()).getTime())/1000).toFixed(2) + " more seconds before using this command again.").then(msg=>setTimeout(function(){if(msg){msg.delete()}},30000));
		}
	} else { //It's not a command we know
		logger.error("Unknown command");
	}
}

client.Dispatcher.on(Discordie.Events.DISCONNECTED, function (e) {
	const delay = 5000;
	const sdelay = Math.floor(delay / 100) / 10;

	if (e.error.message.indexOf("gateway") >= 0) {
		logger.error("Disconnected from gw, resuming in " + sdelay + " seconds");
	} else {
		logger.error("Failed to log in or get gateway, reconnecting in " + sdelay + " seconds");
	}
	setTimeout(function () {
		client.connect({
			token : auth.discord.token
		});
	}, delay);
});


client.Dispatcher.on(Discordie.Events.GUILD_CREATE, function (e) {
	e.guild.createInvite().then(function(inv){
		console.log(inv);
		slave.join(inv.code, function(err, res){
			console.log(err,res);
			
			if(err){
				e.guild.generalChannel.sendMessage("The bot may not work properly because the second invite couldn't join.\nThat account will be used to read a user's profile.\nBot accounts cannot read user profiles. (Discord is weird like that)");
				logger.error(err);
			}
		});
	}, function(err){
		e.guild.generalChannel.sendMessage("The bot may not work properly because I couldn't generate an invite.\nI need to be able to generate an invite in order to get a second account into this server. That account will be used to read a user's profile.\nBot accounts cannot read user profiles. (Discord is weird like that)");	
	});
});

client.Dispatcher.on(Discordie.Events.GUILD_DELETE, function (e) {
	console.log("Hey I left a server");
});


function loadModule(moduleName, moduleFilename, isAlias, aliasFor) {
	if (!moduleFilename && moduleName) {
		moduleFilename = "./plugins/" + moduleName + ".js";
	}

	if (!moduleName && moduleFilename) {
		moduleName = moduleFilename.substring(7, moduleFilename.lastIndexOf("."));
	}
	if (!moduleName && !moduleFilename) {
		logger.error("[MODULE_LOADER]_ERROR: Could not load empty module.");
		return false;
	}
	fs.stat(moduleFilename, function (err, stats) {
		if(err){
			logger.error("[MODULE_LOADER]_ERROR: " + err);
			return false
		}
		
		if(!stats){
			logger.error("[MODULE_LOADER]_ERROR: Failed to load module, no 'stats' variable");
			return false;
		}
	
		if (!stats.isFile()) {
			logger.error("[MODULE_LOADER]_ERROR: Failed to load module, because it is not a file. (" + moduleName + ")");
			return false;
		} else {
			if (moduleFilename.substring(moduleFilename.lastIndexOf(".") + 1) != "js") {
				logger.error("[MODULE_LOADER]_ERROR: Failed to load module, because it is not a JS file. (" + moduleName + ")");
				return false;
			}
		}

		commands[moduleName] = require(moduleFilename);
		if(isAlias){
			delete commands[moduleName].aliases;
			commands[moduleName].isAlias = true;
			commands[moduleName].parent = aliasFor;
		
			logger.stats("[MODULE_LOADER] Successfully loaded alias '" + moduleName + "' inheriting '" + aliasFor + "'");
		}else{
			logger.stats("[MODULE_LOADER] Successfully loaded plugin '" + moduleName + "'");
		}

		if(!isAlias && commands[moduleName].aliases){
			for(i=0;i<commands[moduleName].aliases.length;i++){
				loadModule(commands[moduleName].aliases[i], moduleFilename, true, moduleName);
			}
		}
	});
}

var commandFiles = fs.readdirSync("./plugins/");
for (i = 0; i < commandFiles.length; i++) {
		if (commandFiles[i].substring(0, 7) == "module_" && commandFiles[i].substring(commandFiles[i].lastIndexOf(".")) == ".js") {
			var currentModule = require("./plugins/" + commandFiles[i]);
			if (currentModule.information && currentModule.information.moduleName) {
				loadModule(currentModule.information.moduleName, "./plugins/" + commandFiles[i]);
			} else {
				loadModule(undefined, "./plugins/" + commandFiles[i]);
			}
		}
}

function isInGroup(user, group) {
	if (userDB[user]) {
		return userDB[user].groups.indexOf(group) > -1;
	} else {
		return false;
	}
}

function makeBackup() {
	var backupName = (new Date()).toLocaleString('nl-NL').replace(/\//g, '-');
	fs.mkdir('./backups/' + backupName, function(err,res){
		if(!err){
			ncp('./db/', './backups/' + backupName,function(err){
			if(err){
				logger.error('Error creating backup\n' + err);
			}
			});
		}else{
			logger.error('Error creating backup\n' + err);
		}
	});
}

function executeCommand(command, e, user){
	GLOBAL.commands++;
	e.GLOBAL = {
		commands : commands,
		config : config,
		GLOBAL : GLOBAL
	};
	command.cooldowns[e.message.author.id] = (new Date()).getTime();
	command.action(client, e);
	return;
}


function download(url, dest, cb) {
	if(url.substring(0,8) == 'https://')
	url = "http://" + url.substring(8);
	var file = fs.createWriteStream(dest);
	var request = http.get(url, function (response) {
		response.pipe(file);
		file.on('finish', function () {
		file.close(cb); // close() is async, call cb after close completes.
		});
	}).on('error', function (err) { // Handle errors
		fs.unlink(dest); // Delete the file async. (But we don't check the result)
		if (cb)
		cb(err.message);
	});
};

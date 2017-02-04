var fs = require('fs');
var userDB = require("../db/users.json");

module.exports = {
	information : {
		moduleName : "cleandb"
	},
	description : "cleandb - [REDACTED]",
	permissions : {
		groups: ['root']
	},
	hide: true,
	cooldown: 5000,
	action : function (client, e) {
		var before = new Date().getTime();
		var newUserDB = {};
		for(i=0;i<Object.keys(userDB).length;i++){
			if(userDB[Object.keys(userDB)[i]].groups.length == 1 && userDB[Object.keys(userDB)[i]].groups[0] == 'default'){
				//console.log("deleting " + Object.keys(userDB)[i]);
			}else{
				console.log("Keeping " + Object.keys(userDB)[i], userDB[Object.keys(userDB)[i]].groups);
				newUserDB[Object.keys(userDB)[i]] = JSON.parse(JSON.stringify(userDB[Object.keys(userDB)[i]]));
				if(newUserDB[Object.keys(userDB)[i]].games)
					delete newUserDB[Object.keys(userDB)[i]].games;
				if(newUserDB[Object.keys(userDB)[i]].currentlyTracking)
					delete newUserDB[Object.keys(userDB)[i]].currentlyTracking;
				
			}
		}
		e.message.channel.sendMessage("Took: " + (new Date().getTime() - before) + "ms");
		console.log("Done");
		fs.writeFile('./db/cleanUserDB.json', JSON.stringify(newUserDB,null,4))
	}
}

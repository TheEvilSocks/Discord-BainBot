var fs = require('fs');

module.exports = {
	information : {
		moduleName : "addall"
	},
	lastTime : 0,
	cooldown : 1000,
	description : "!addall - Shows all commands.",
	hide: true,
	permissions : {
		groups: ["root"]
	},
	action : function (client, e) {
		try{
			var oldweapons = JSON.parse(fs.readFileSync('./db/allWeapons.json', 'utf8'));
			var allweapons = []; 
			var prim = JSON.parse(fs.readFileSync('./db/primary.json', 'utf8'));
			var seco = JSON.parse(fs.readFileSync('./db/secondary.json', 'utf8'));
			var ids = JSON.parse(fs.readFileSync('./db/weaponIDs.json', 'utf8'));
			
			for(i=0;i<Object.keys(prim).length;i++){
				var curWeap_ = prim[Object.keys(prim)[i]];
				var curWeap = {};
				for(j=0;j<Object.keys(curWeap_).length;j++){
					curWeap[Object.keys(curWeap_)[j]] = curWeap_[Object.keys(curWeap_)[j]];
					curWeap[Object.keys(curWeap_)[j]].slot = "primary";
					curWeap[Object.keys(curWeap_)[j]].ID = ids.indexOf(Object.keys(curWeap_)[j]);
					curWeap[Object.keys(curWeap_)[j]].Type = "gun";
				}
				allweapons.push(curWeap);
			}
			for(i=0;i<Object.keys(seco).length;i++){
				var curWeap_ = seco[Object.keys(seco)[i]];
				var curWeap = {};
				for(j=0;j<Object.keys(curWeap_).length;j++){
					curWeap[Object.keys(curWeap_)[j]] = curWeap_[Object.keys(curWeap_)[j]];
					curWeap[Object.keys(curWeap_)[j]].slot = "secondary";
					curWeap[Object.keys(curWeap_)[j]].ID = ids.indexOf(Object.keys(curWeap_)[j]);
					curWeap[Object.keys(curWeap_)[j]].Type = "gun";
				}
				allweapons.push(curWeap);
			}
			fs.writeFile('./db/allWeapons.json', JSON.stringify(allweapons,null,4))
			e.message.channel.sendMessage("Am done, bby ♥\n\n**New amount:** " + allweapons.length + "\n**Old amount:** " + oldweapons.length);
		}catch(e_){
			e.message.channel.sendMessage("```js\n" + e_ + "```");
		}
	}
}

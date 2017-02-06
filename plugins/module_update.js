var git = require("nodegit");
var fs = require("fs");

module.exports = {
	information : {
		moduleName : "update",
		description : "!update - Download new files from the git",
	},
	action : function (client, e, logger) {
		var startDate = new Date().getTime()
		fs.stat("./plugins/cache/git", function(err, stats){
			if(err && err.code == "ENOENT"){ // This is what we want. We dont want the git folder already existing.

				git.Clone("https://github.com/TheEvilSocks/Discord-Bain", "./plugins/cache/git").then(function(repo){
					var weaponFolder = './plugins/cache/git/weapons/';
					var weaponFiles = fs.readdirSync(weaponFolder);
					var weapons = {};

					for(i = 0; i < weaponFiles.length; i++){
						var weapon = fs.readFileSync(weaponFolder + weaponFiles[i], 'utf8');
						fs.writeFileSync('./db/payday/weapons/' + weaponFiles[i], weapon, 'utf8');
					}

					while(i == weaponFiles.length){
						e.message.channel.sendMessage("Downloaded **" + weaponFiles.length + "** weapon files.\n**Took:** `" + (new Date().getTime() - startDate) + "ms`");
						delete weaponFolder;
						delete weaponFiles;
						delete weapon;
						delete i;
						rmDir("./plugins/cache/git");
						if('weapon' in e.GLOBAL.commands)
							e.GLOBAL.commands.weapon.reload()
					}
				});

			}else{
				e.message.channel.sendMessage("Git folder already exists. Removing...");
				rmDir("./plugins/cache/git");
			}
		});
	}
}


var rmDir = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) {
        rmDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
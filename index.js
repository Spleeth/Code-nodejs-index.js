const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));
const prefix = config.prefix;

client.on('ready', function () {
    console.log(`Loggé en : ${client.user.tag}`);
    console.log("Client started !")
})

//Command : Ping
client.on("message", (message) => {
    if (message.content.startsWith(prefix + "ping")) {
      message.channel.send("pong!");
    }
  });

//Systeme de Level
client.on("message", message => {
    if (message.author.bot) return; // ignorer les bots

    if (!db[message.author.id]) db[message.author.id] = {
        xp: 0, 
        level: 0,
        rank: "Inconnu",
        badges: "<:badge_membre:794206324455899156>"
      };
    db[message.author.id].xp++;
    let userInfo = db[message.author.id];
    if(userInfo.xp > 100) {
        userInfo.level++
        userInfo.xp = 0
        message.reply("**Level UP !** Vous venez de passer un niveau !")
    }
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd === "profil") {
        let userInfo = db[message.author.id];
        if(userInfo.level >= 75){
            userInfo.rank = "Seigneur"
        }else{
            if(userInfo.level >= 50){
                userInfo.rank = "Noble"
            }else{
                if(userInfo.level >= 25){
                    userInfo.rank = "Chevalier"
                }else{
                    if(userInfo.level >= 1){
                        userInfo.rank = "Paysans"
                    }else{
                        userInfo.rank = "Inconnu"
                    }
                }
            }
        }
        let profilEmbed = new Discord.MessageEmbed()
            .setColor('#'+Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0'))
            .addField('Level', userInfo.level)
            .addField('XP', userInfo.xp+'/100')
            .addField('Rang',  userInfo.rank)
            .addField('Badges', userInfo.badges)
            .setThumbnail(message.author.displayAvatarURL());
	       message.channel.send(profilEmbed)
    }
    fs.writeFile("./database.json", JSON.stringify(db), (x) => {
        if (x) console.error(x)
    });
    });

client.login(config.token)

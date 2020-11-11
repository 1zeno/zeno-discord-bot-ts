const Discord = require("discord.js");
const bot = new Discord.Client();
const token = require("./token.json");

bot.once("ready", () => {
    console.log("BIG BOT Zeno está online!");
});

bot.login(token.BOT_TOKEN);
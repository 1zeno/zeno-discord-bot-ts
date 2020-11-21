const { Client } = require("discord.js");
const bot = new Client();
const token = require("./token.json");

const ytdl = require("ytdl-core");

const PREFIX = "$";

let servers = {};

bot.on("ready", () => {
    console.log("BIG BOT Zeno está online!");
});

bot.on("message", message => {
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "play":

            function play (connection, message){
                let server = servers[message.guild.id];

                server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));

                server.queue.shift();

                server.dispatcher.on("finish", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else{
                        connection.disconnect();
                    }
                });
            }

            if(!args[1]){
                message.channel.send("você precisa enviar um link!");
                return;
            }

            if(!message.member.voice.channel){
                message.channel.send("você precisa estar em um canal para utilizar esse comando!");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            let server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.me.voice.connection) message.member.voice.channel.join().then( ( connection ) => {
                play(connection, message);
            });
        break;

        case "skip":
            let serverSkip = servers[message.guild.id];

            if(serverSkip.dispatcher) serverSkip.dispatcher.end();
            message.channel.send("Pulou uma música.");

        break;

        case "stop":
            let serverStop = servers[message.guild.id];

            if(message.guild.voice){
                if(message.guild.voice.connection){
                    for(let i = serverStop.queue.length -1; i>= 0; i--){
                        serverStop.queue.splite(i, 1);
                    }
                    message.channel.send("Fim da lista. Estou saindo do chat de voz.");
                    serverStop.dispatcher.end()    
                    console.log("stopped the queue");
                }
            }
            
        break;

        case "leave":
            if(message.guild.voice.connection) message.guild.voice.connection.disconnect();
        break;
    }
});

bot.login(token.BOT_TOKEN);
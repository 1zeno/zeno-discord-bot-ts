import { Client, StreamDispatcher } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";
import play from "./commands/play";

export type Server = { queue: string[], dispatcher?: StreamDispatcher };
export type Servers = Record<string, Server>;

dotenv.config();
const bot = new Client();

const PREFIX = process.env.PREFIX || "$";

let servers: Servers = {};

bot.on("ready", () => {
    console.log("BIG BOT Zeno está online!");
});

bot.on("message", message => {

    const prefixMessage = message.content.split("")[0];

    if(prefixMessage !== PREFIX) {
        return;
    }

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {

        case "commands":
            message.channel.send("Comandos disponíveis: $play // $skip // $stop // $leave // $kabum_price")
        break;

        case "play":
            
            play(args, message, servers);

        break;

        case "skip":
            let serverSkip = servers[message.guild.id];

            if(message.guild.voice && message.guild.me.voice ){
                if(serverSkip){
                    if(serverSkip.dispatcher) serverSkip.dispatcher.end();
                    message.channel.send("Pulou uma música.");
                }else{
                    message.channel.send("Não tem nada pra pular.");
                }
            }else{
                message.channel.send("ME COLOCA NA SUA CALL!!!!!!!");
            }

        break;

        case "stop":
            let serverStop = servers[message.guild.id];

            if(message.guild.voice && message.guild.me.voice ){
                if(message.guild.voice.connection){
                    for(let i = serverStop.queue.length -1; i>= 0; i--){
                        serverStop.queue.slice(i, 1);
                    }
                    message.channel.send("Fim da lista. Estou saindo do chat de voz.");
                    serverStop.dispatcher.end()
                }
            }else{
                message.channel.send("ME COLOCA NA SUA CALL!!!!!!!");
            }
            
        break;

        case "leave":
            if(message.guild.voice){
                if(message.guild.voice.connection) message.guild.voice.connection.disconnect();
            }else{
                message.channel.send("ME COLOCA NA CALL!!!!!!!");
            }
        break;

    }
});

bot.login(process.env.BOT_TOKEN);

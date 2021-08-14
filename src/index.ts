import { Client, StreamDispatcher } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";
import play from "./commands/play";

export type Server = { queue: string[], dispatcher?: StreamDispatcher };
export type Servers = Record<string, Server>;

dotenv.config();
const bot = new Client();

const PREFIX = process.env.PREFIX;
let readyToPlay = true;
let servers: Servers = {};

const setReadyToPlay = (value: boolean) => {
    readyToPlay = value;
}

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
            message.channel.send("```Comandos disponíveis:\n$play [nome da música ou link do youtube], \n$skip (pula uma música), \n$stop (tira todas as músicas da fila e sai da chamada), \n$leave (sai da chamada)```");
        break;

        case "play":
            if(!readyToPlay){
                return message.channel.send("Aguarde a música anterior ser adicionada na fila.");
            }
            play(args, message, servers, setReadyToPlay);

        break;

        case "skip":
            let server = servers[message.guild.id];

            if(message.guild.voice && message.guild.me.voice ){
                if(server){
                    if(server.dispatcher) {
                        if(server.dispatcher.writableEnded){
                            message.channel.send("Não tem nada pra pular.");
                        }else{
                            message.channel.send("Pulou uma música.");
                        };
                        server.dispatcher.end();
                        setTimeout(() => {
                            if(server.queue.length < 1 && message.guild.voice.connection && server.dispatcher.writableEnded){
                                message.guild.voice.connection.disconnect();
                            }
                        }, 900000);
                    }
                }
            }else{
                message.channel.send("ME COLOCA NA SUA CALL!!!!!!!");
            }

        break;

        case "stop":
            let serverStop = servers[message.guild.id];

            if(message.guild.voice && message.guild.me.voice ){
                if(message.guild.voice.connection){
                    serverStop.queue = [];
                    message.channel.send("Fim da lista. Estou saindo do chat de voz.");
                    serverStop.dispatcher.end()
                    message.guild.voice.connection.disconnect();
                }
            }else{
                message.channel.send("ME COLOCA NA SUA CALL!!!!!!!");
            }
            
        break;

        case "leave":
            if(message.guild.voice){
                if(message.guild.voice.connection) {
                    message.guild.voice.connection.disconnect();
                };
            }else{
                message.channel.send("ME COLOCA NA CALL!!!!!!!");
            }
        break;

    }
});

bot.login(process.env.BOT_TOKEN);

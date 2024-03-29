import scrapeMusic from "./scrapeMusic";
import playMusic from "./playMusic";
import { Message } from "discord.js";
import { Servers, Server } from "../../";

const play = async (args: string[], message: Message, servers: Servers , setReadyToPlay: (value: boolean) => void) => {
    message.channel.send("Por favor, aguarde...");

    if(!args[1]){
        message.channel.send("você precisa enviar um link!");
        return;
    };

    if(!message.member.voice.channel){
        message.channel.send("você precisa estar em um canal para utilizar esse comando!");
        return;
    };

    if(!servers[message.guild.id]) {
        servers[message.guild.id] = {
            queue: [],
        };
    };

    let server: Server = servers[message.guild.id];

    let ytbUrl: string[] = args[1].split("=");

    const pushQueue = (url: string) => {
        server.queue.push(url);
    };
    
    if(ytbUrl[0] === "https://www.youtube.com/watch?v") {
        pushQueue(args[1]);
        message.channel.send("Sua música foi adicionada na fila!");
    }else{
        args.shift();
        let musicName: string = args.join("+");
        let searchUrl: string = `https://www.youtube.com/results?search_query=${musicName}`;
        try{
            setReadyToPlay(false);
            const url = await scrapeMusic(searchUrl);
            pushQueue(url);
            message.channel.send(`Coloquei ${url} na fila`);
        }catch(e){
            console.log(e.message);
        }finally{
            setReadyToPlay(true);
        }

    
    };

    const startMusic = async() => {
        if(!message.guild.me.voice.connection){
            try{
                const connection = await message.member.voice.channel.join();
                playMusic(connection, message, server);
            }catch(e){
                console.log("Erro ao iniciar música", e.message);
            }
        }else{
            if(server.queue.length === 1 && message.guild.me.voice.connection && server.dispatcher.writableEnded){
                playMusic(message.guild.me.voice.connection, message, server);
            }
        };
    };
    startMusic();
}

export default play;

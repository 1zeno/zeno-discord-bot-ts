import ytdl from "ytdl-core";
import { VoiceConnection, Message } from "discord.js";
import { Server } from "../../../";

const playMusic = (connection: VoiceConnection, message: Message, server: Server, timeout: any) => {

    server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));

    server.queue.shift();

    server.dispatcher.on("finish", function(){
        if(server.queue.length > 0){
            playMusic(connection, message, server, timeout);
        }else{
            connection.voiceManager.client.setTimeout(() => {
                if(server.queue.length < 1 && server.dispatcher.writableEnded){
                    connection.disconnect();
                }
            }, 900000);
            
            message.channel.send("Não há mais músicas na lista.");
        }
    });
}

export default playMusic
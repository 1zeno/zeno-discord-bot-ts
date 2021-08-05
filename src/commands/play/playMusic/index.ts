import ytdl from "ytdl-core";
import { VoiceConnection, Message } from "discord.js";
import { Server } from "../../../";

const playMusic = (connection: VoiceConnection, message: Message, server: Server) => {

    server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));

    server.queue.shift();

    server.dispatcher.on("finish", function(){
        if(server.queue[0]){
            playMusic(connection, message, server);
        }else{
            connection.disconnect();
        }
    });
}

export default playMusic
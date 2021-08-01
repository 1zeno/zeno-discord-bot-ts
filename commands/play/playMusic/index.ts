import ytdl from "ytdl-core";
//const ytdl = require("ytdl-core");
const playMusic = (connection, message, server) => {

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
import scrapeMusic from "./scrapeMusic";
import playMusic from "./playMusic";

const play = async (args, message, servers) => {
    message.channel.send("Por favor, aguarde...");

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

    let ytbUrl = args[1].split("=");
    
    if(ytbUrl[0] === "https://www.youtube.com/watch?v") {
        server.queue.push(args[1]);
        message.channel.send("Sua música foi adicionada na fila!");
    }else{
        args.shift();
        let musicName = args.join("+");
        let searchUrl = `https://www.youtube.com/results?search_query=${musicName}`;
        const result = await scrapeMusic(searchUrl)
        server.queue.push(result);
        message.channel.send(`Coloquei ${result} na fila`);

    
    }

    const startMusic = async() => {
        if(!message.guild.me.voice.connection){
            try{
                const connection = await message.member.voice.channel.join();
                playMusic(connection, message, server);
            }catch(e){
                console.log("Erro ao iniciar música", e.message);
            }
        }
    }
    setTimeout(startMusic, 8000)
}

export default play;

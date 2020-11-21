const { Client } = require("discord.js");
const bot = new Client();
const token = require("./token.json");

const ytdl = require("ytdl-core");
const puppeteer = require("puppeteer");

const PREFIX = "$";

let servers = {};

bot.on("ready", () => {
    console.log("BIG BOT Zeno está online!");
});

bot.on("message", message => {
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {

        case "commands":
            message.channel.send("Comandos disponíveis: $play // $skip // $stop // $leave // $ará")
        break;

        case "play":
            message.channel.send("Por favor, aguarde...");

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

            async function scrapeProduct(url){
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto(url);
            
                const [el] = await page.$x('//*[@id="video-title"]');
                const src = await el.getProperty("href");
                const srcTxt = await src.jsonValue();
            
                browser.close();
                return srcTxt;
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

            let ytbUrl = args[1].split("=");
            
            if(ytbUrl[0] === "https://www.youtube.com/watch?v") {
                server.queue.push(args[1]);
                message.channel.send("Sua música foi adicionada na fila!");
            }else{
                args.shift();
                let musicName = args.join("+");
                let searchUrl = `https://www.youtube.com/results?search_query=${musicName}`;
                scrapeProduct(searchUrl).then((result) => {
                    server.queue.push(result);
                    message.channel.send(`Coloquei ${result} na fila`);
                 })
               
            }

            const startMusic = () => {
                if(!message.guild.me.voice.connection) message.member.voice.channel.join().then( ( connection ) => {
                    play(connection, message);
                });
            }
            setTimeout(startMusic, 5000)
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
                        serverStop.queue.splite(i, 1);
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

bot.login(token.BOT_TOKEN);

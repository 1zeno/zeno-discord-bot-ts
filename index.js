const { Client } = require("discord.js");
const bot = new Client();
const token = require("./token.json");

const ytdl = require("ytdl-core");
const puppeteer = require("puppeteer");
const axios = require("axios");

const PREFIX = "$";

let servers = {};

bot.on("ready", () => {
    console.log("BIG BOT Zeno está online!");
});

bot.on("message", message => {

    const prefixMessage = message.content.split("")[0];
    if(prefixMessage !== PREFIX) return;

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {

        case "commands":
            message.channel.send("Comandos disponíveis: $play // $skip // $stop // $leave // $kabum_price")
        break;

        case "riot":
            const request = async() => {
                const result = await axios.post('https://mangalivre.net/lib/search/series.json',{ "search": "shingeki no kyojin"},{
                    headers:{ "Content-Type": "application/json","X-Requested-With": "XMLHttpRequest"},
                  });
                const baseUrl = `https://mangalivre.net/manga/shingeki-no-kyojin/210`;
                const completeUrl = baseUrl+result.data.series[0].link;
                const resultSecond = await axios.post(completeUrl,{ "search": "shingeki no kyojin"},{
                    headers:{ "Content-Type": "application/json","X-Requested-With": "XMLHttpRequest"},
                });
            };
            request();
            message.channel.send("<h1>aoba</h1>")
        break;

        case "play":
            message.channel.send("Por favor, aguarde...");

            const play = (connection, message, server) => {

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

            const scrapeMusic = async(url) => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto(url);
            
                const [el] = await page.$x('//*[@id="video-title"]');
                const href = await el.getProperty("href");
                const hrefTxt = await href.jsonValue();
            
                browser.close();
                return hrefTxt;
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
                scrapeMusic(searchUrl).then((result) => {
                    server.queue.push(result);
                    message.channel.send(`Coloquei ${result} na fila`);
                 })
               
            }

            const startMusic = () => {
                if(!message.guild.me.voice.connection) message.member.voice.channel.join().then( ( connection ) => {
                    play(connection, message, server);
                });
            }
            setTimeout(startMusic, 8000)
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
                        serverStop.queue.split(i, 1);
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

        case "ará":
            message.channel.send({
                files: ["./images/ara.jpeg"]
              })
        break;

        case "kabum_price":
            args.shift();
            let productName = args.join(" ");
            let productNameSearch = args.join("+");
            let searchProduct = `https://www.kabum.com.br/cgi-local/site/listagem/listagem.cgi?string=${productNameSearch}&btnG=`;
            async function scrapeProduct(url){
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto(url);
            
                const [el] = await page.$x('//*[@id="listagem-produtos"]/div/div[3]/div/div[2]/div[1]/div[3]');
                const [elPromo] = await page.$x('//*[@id="listagem-produtos"]/div/div[3]/div/div[2]/div[1]/div[4]');
                        const txtPromo = await elPromo.getProperty("textContent");
 
                        const txt = await el.getProperty("textContent");
                        let text;
                        let txtProductName;
                if(txtPromo){
                    if(await txtPromo.jsonValue() !== "no boleto") {
                        text = await txtPromo.jsonValue();
                        const [elName] = await page.$x('//*[@id="listagem-produtos"]/div/div[3]/div/div[1]/a');
                        txtProductName = await elName.getProperty("textContent");
                    }else{
                        text = await txt.jsonValue();
                    }
                }else{
                    text = await txt.jsonValue();
                }
                const [elName] = await page.$x('//*[@id="listagem-produtos"]/div/div[3]/div/div[1]/a');
                const nameProduct = await elName.getProperty("textContent");
                productName = await nameProduct.jsonValue();

                browser.close();
                return text;
            }
            scrapeProduct(searchProduct).then((result) => {
                message.channel.send(`O preço do ${productName} é ${result} à vista`);
             })
        break;

    }
});

bot.login(token.BOT_TOKEN);

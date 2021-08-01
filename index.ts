import { Client } from "discord.js";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import axios from "axios";

import play from "./commands/play";

dotenv.config();
const bot = new Client();

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

        case "kabum_price":
            args.shift();
            let productName = args.join(" ");
            let productNameSearch = args.join("+");
            let searchProduct = `https://www.kabum.com.br/cgi-local/site/listagem/listagem.cgi?string=${productNameSearch}&btnG=`;
            const scrapeProduct = async (url) => {
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

bot.login(process.env.BOT_TOKEN);

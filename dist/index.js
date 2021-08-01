"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const axios_1 = __importDefault(require("axios"));
const play_1 = __importDefault(require("./commands/play"));
dotenv_1.default.config();
const bot = new discord_js_1.Client();
const PREFIX = "$";
let servers = {};
bot.on("ready", () => {
    console.log("BIG BOT Zeno está online!");
});
bot.on("message", message => {
    const prefixMessage = message.content.split("")[0];
    if (prefixMessage !== PREFIX)
        return;
    let args = message.content.substring(PREFIX.length).split(" ");
    switch (args[0]) {
        case "commands":
            message.channel.send("Comandos disponíveis: $play // $skip // $stop // $leave // $kabum_price");
            break;
        case "riot":
            const request = () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield axios_1.default.post('https://mangalivre.net/lib/search/series.json', { "search": "shingeki no kyojin" }, {
                    headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
                });
                const baseUrl = `https://mangalivre.net/manga/shingeki-no-kyojin/210`;
                const completeUrl = baseUrl + result.data.series[0].link;
                const resultSecond = yield axios_1.default.post(completeUrl, { "search": "shingeki no kyojin" }, {
                    headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
                });
            });
            request();
            message.channel.send("<h1>aoba</h1>");
            break;
        case "play":
            play_1.default(args, message, servers);
            break;
        case "skip":
            let serverSkip = servers[message.guild.id];
            if (message.guild.voice && message.guild.me.voice) {
                if (serverSkip) {
                    if (serverSkip.dispatcher)
                        serverSkip.dispatcher.end();
                    message.channel.send("Pulou uma música.");
                }
                else {
                    message.channel.send("Não tem nada pra pular.");
                }
            }
            else {
                message.channel.send("ME COLOCA NA SUA CALL!!!!!!!");
            }
            break;
        case "stop":
            let serverStop = servers[message.guild.id];
            if (message.guild.voice && message.guild.me.voice) {
                if (message.guild.voice.connection) {
                    for (let i = serverStop.queue.length - 1; i >= 0; i--) {
                        serverStop.queue.split(i, 1);
                    }
                    message.channel.send("Fim da lista. Estou saindo do chat de voz.");
                    serverStop.dispatcher.end();
                }
            }
            else {
                message.channel.send("ME COLOCA NA SUA CALL!!!!!!!");
            }
            break;
        case "leave":
            if (message.guild.voice) {
                if (message.guild.voice.connection)
                    message.guild.voice.connection.disconnect();
            }
            else {
                message.channel.send("ME COLOCA NA CALL!!!!!!!");
            }
            break;
        case "kabum_price":
            args.shift();
            let productName = args.join(" ");
            let productNameSearch = args.join("+");
            let searchProduct = `https://www.kabum.com.br/cgi-local/site/listagem/listagem.cgi?string=${productNameSearch}&btnG=`;
            const scrapeProduct = (url) => __awaiter(void 0, void 0, void 0, function* () {
                const browser = yield puppeteer_1.default.launch();
                const page = yield browser.newPage();
                yield page.goto(url);
                const [el] = yield page.$x('//*[@id="listagem-produtos"]/div/div[3]/div/div[2]/div[1]/div[3]');
                const [elPromo] = yield page.$x('//*[@id="listagem-produtos"]/div/div[3]/div/div[2]/div[1]/div[4]');
                const txtPromo = yield elPromo.getProperty("textContent");
                const txt = yield el.getProperty("textContent");
                let text;
                let txtProductName;
                if (txtPromo) {
                    if ((yield txtPromo.jsonValue()) !== "no boleto") {
                        text = yield txtPromo.jsonValue();
                        const [elName] = yield page.$x('//*[@id="listagem-produtos"]/div/div[3]/div/div[1]/a');
                        txtProductName = yield elName.getProperty("textContent");
                    }
                    else {
                        text = yield txt.jsonValue();
                    }
                }
                else {
                    text = yield txt.jsonValue();
                }
                const [elName] = yield page.$x('//*[@id="listagem-produtos"]/div/div[3]/div/div[1]/a');
                const nameProduct = yield elName.getProperty("textContent");
                productName = yield nameProduct.jsonValue();
                browser.close();
                return text;
            });
            scrapeProduct(searchProduct).then((result) => {
                message.channel.send(`O preço do ${productName} é ${result} à vista`);
            });
            break;
    }
});
bot.login(process.env.BOT_TOKEN);
//# sourceMappingURL=index.js.map
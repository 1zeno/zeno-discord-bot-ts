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
const scrapeMusic_1 = __importDefault(require("./scrapeMusic"));
const playMusic_1 = __importDefault(require("./playMusic"));
const play = (args, message, servers) => __awaiter(void 0, void 0, void 0, function* () {
    message.channel.send("Por favor, aguarde...");
    if (!args[1]) {
        message.channel.send("você precisa enviar um link!");
        return;
    }
    if (!message.member.voice.channel) {
        message.channel.send("você precisa estar em um canal para utilizar esse comando!");
        return;
    }
    if (!servers[message.guild.id])
        servers[message.guild.id] = {
            queue: []
        };
    let server = servers[message.guild.id];
    let ytbUrl = args[1].split("=");
    if (ytbUrl[0] === "https://www.youtube.com/watch?v") {
        server.queue.push(args[1]);
        message.channel.send("Sua música foi adicionada na fila!");
    }
    else {
        args.shift();
        let musicName = args.join("+");
        let searchUrl = `https://www.youtube.com/results?search_query=${musicName}`;
        const result = yield scrapeMusic_1.default(searchUrl);
        server.queue.push(result);
        message.channel.send(`Coloquei ${result} na fila`);
    }
    const startMusic = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!message.guild.me.voice.connection) {
            try {
                const connection = yield message.member.voice.channel.join();
                playMusic_1.default(connection, message, server);
            }
            catch (e) {
                console.log("Erro ao iniciar música", e.message);
            }
        }
    });
    setTimeout(startMusic, 8000);
});
exports.default = play;
//# sourceMappingURL=index.js.map
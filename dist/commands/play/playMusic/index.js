"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
//const ytdl = require("ytdl-core");
const playMusic = (connection, message, server) => {
    server.dispatcher = connection.play(ytdl_core_1.default(server.queue[0], { filter: "audioonly" }));
    server.queue.shift();
    server.dispatcher.on("finish", function () {
        if (server.queue[0]) {
            playMusic(connection, message, server);
        }
        else {
            connection.disconnect();
        }
    });
};
exports.default = playMusic;
//# sourceMappingURL=index.js.map
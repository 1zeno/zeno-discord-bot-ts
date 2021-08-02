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
const puppeteer_1 = __importDefault(require("puppeteer"));
//const puppeteer = require("puppeteer");
const scrapeMusic = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer_1.default.launch({ ignoreDefaultArgs: ['--disable-extensions'] });
        const page = yield browser.newPage();
        yield page.goto(url);
        const [el] = yield page.$x('//*[@id="video-title"]');
        const href = yield el.getProperty("href");
        const hrefTxt = yield href.jsonValue();
        browser.close();
        return hrefTxt;
    }
    catch (e) {
        console.log("Ocorreu um erro ao iniciar scrapeMusic", e.message);
    }
});
exports.default = scrapeMusic;
//# sourceMappingURL=index.js.map
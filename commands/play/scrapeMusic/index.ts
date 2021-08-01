//import puppeteer from "puppeteer";
const puppeteer = require("puppeteer");
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

export default scrapeMusic;
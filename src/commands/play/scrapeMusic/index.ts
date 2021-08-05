import puppeteer from "puppeteer";

const scrapeMusic = async(url) => {
    try{
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(url);
    
        const [el] = await page.$x('//*[@id="video-title"]');
        const href = await el.getProperty("href");
        const hrefTxt = await href.jsonValue();
    
        browser.close();
        return hrefTxt;
    }catch(e){
        console.log("Ocorreu um erro ao iniciar scrapeMusic", e.message);
    }
   
}

export default scrapeMusic;
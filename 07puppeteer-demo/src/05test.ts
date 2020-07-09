import * as puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://v.douyin.com/WuRMPV/");
  await page.waitForSelector(".play-btn");
  const d = await page.frames();
  let iframe = d[0];
  console.log("iframe: ", iframe);
  const unfoldButtn = await iframe.$(".play-btn");
  await page.waitFor(4000);
  await unfoldButtn.click();
  await page.waitFor(4000);
  const c = await page.frames();
  const video = await iframe.$("#pageletReflowVideo .player");
  console.log("video: ", (video as any)?.src);
})();

const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  // 进入页面
  await page.goto("https://music.163.com/#");
  // 点击输入框模拟输入
  const musicName = "123我爱你";
  await page.type(".txt.j-flag", musicName, { delay: 0 });
  await page.keyboard.press("Enter");
  //获取歌曲列表的iframe
  await page.waitFor(4000);
  let iframe = await page.frames().find((f) => f.name() === "contentFrame");
  const SONG_LS_SELECTOR = await iframe.$(".srchsongst");
  // console.log("SONG_LS_SELECTOR: ", SONG_LS_SELECTOR);
  // 获取歌曲的地址
  const selectedSongHref = await iframe.evaluate(
    (e, musicName) => {
      const songList = Array.from(e.childNodes);
      const idx = songList.findIndex(
        (v) => v.childNodes[1].innerText.replace(/\s/g, "") === musicName
      );
      return songList[idx].childNodes[1].firstChild.firstChild.firstChild.href;
    },
    SONG_LS_SELECTOR,
    musicName
  );
  // console.log("selectedSongHref: ", selectedSongHref);

  // 进入歌曲的页面
  await page.goto(selectedSongHref);
  // 获取歌曲嵌套页面的iframe
  await page.waitFor(2000);
  iframe = await page.frames().find((f) => f.name() === "contentFrame");
  // 点击展开按钮
  const unfoldButtn = await iframe.$("#flag_ctrl");
  await unfoldButtn.click();
  // 获取歌词
  const LYRIC_SELECTOR = await iframe.$("#lyric-content");
  const lyricCtn = await iframe.evaluate((e) => {
    return e.innerText;
  }, LYRIC_SELECTOR);
  console.log("lyricCtn: ", lyricCtn);

  await page.screenshot({
    path: "歌曲.png",
    fullPage: true,
  });
  // 写入文件
  let writerStream = fs.createWriteStream("歌词.txt");
  writerStream.write(lyricCtn, "UTF8");
  writerStream.end();

  // 获取评论数量
  const commentCount = await iframe.$eval(".sub.s-fc3", (e) => e.innerText);
  // console.log(commentCount);

  // 获取评论
  const commentList = await iframe.$$eval(".itm", (elements) => {
    const ctn = elements.map((v) => {
      return v.innerText.replace(/\s/g, "");
    });
    return ctn;
  });
  // console.log(commentList);
  browser.close();
})();

const puppeteer = require("puppeteer");

async function getPdf (url, index, browser) {
  console.log(index);
  console.log('开始了');


  const page = await browser.newPage();
  await page.goto(
    url
  );
  await page.evaluate(async () => {
    const style = document.createElement('style');
    style.type = 'text/css';
    const content = `
    .nav {
      display: none;
    }
    .warpper{
      padding:0;
      height:unset !important;
      display:flex;
    }
    .page-toc{
      position:static !important;
    }
    .content.markdown-body{
      margin-left:0 !important;
      flex:1;
    }
  `;
    style.appendChild(document.createTextNode(content));
    const promise = new Promise((resolve, reject) => {
      style.onload = resolve;
      style.onerror = reject;
    });
    document.head.appendChild(style);
    await promise;
  });
  await page.pdf({ path: './pdf/' + index + '.pdf' });
  await page.close()
}
async function main () {
  const browser = await puppeteer.launch({
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    // executablePath:
    // "/Users/huqiyang/Documents/project/z/chromium/Chromium.app/Contents/MacOS/Chromium",
    //设置超时时间
    timeout: 15000,
    //如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 关闭headless模式, 不会打开浏览器
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(
    'http://xxxxxxxx'
  );
  await page.waitFor(2000);
  let data = []
  data = await page.evaluate(async (data) => {
    return Array.from(document.querySelectorAll('.nav ul li')).map(i => ({ text: i.textContent, html: i.innerHTML })).map(i => {
      let tempNode = document.createElement('div');
      tempNode.innerHTML = i.html;
      return { ...i, href: tempNode.getElementsByTagName('a')[0].href }
    })
  }, data);
  console.log(data.length);


  const browser2 = await puppeteer.launch({
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    // executablePath:
    // "/Users/huqiyang/Documents/project/z/chromium/Chromium.app/Contents/MacOS/Chromium",
    //设置超时时间
    timeout: 15000,
    //如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 关闭headless模式, 不会打开浏览器
    headless: true,
  });
  console.log(new Date())
  for (let index = 0; index < data.length; index++) {
    // 启动计时器
    console.time('testForEach');
    const element = data[index];
    await getPdf(element.href, element.text, browser2)

    // (写一些测试用代码)

    // 停止计时，输出时间
    console.timeEnd('testForEach');
  }
  console.log(new Date())
  browser.close();
  browser2.close();

}

main()

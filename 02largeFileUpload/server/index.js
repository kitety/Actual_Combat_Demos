const http = require("http");
const multiparty = require("multiparty");
const path = require("path");
const fse = require("fs-extra");
const server = http.createServer();

const UPLOAD_DIR = path.resolve(__dirname, "..", "target"); //大文件存储目录
server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }
  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, fields, files) => {
    console.log("files: ", files);
    console.log("fields: ", fields);
    if (err) {
      return;
    }
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [filename] = fields.filename;
    const chunkDir = path.resolve(UPLOAD_DIR, filename);
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir);
    }
    // fse-extra专用方法，类似于fa.rename 跨平台
    // fs-extra的rename方法在win有权限问题
    await fse.move(chunk.path, `${chunkDir}/${hash}`);
    res.end("received file chunk");
  });
});
server.listen(3000, () => {
  console.log("正在监听 3000 端口");
});

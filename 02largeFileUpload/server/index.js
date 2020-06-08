const http = require("http");
const multiparty = require("multiparty");
const path = require("path");
const fse = require("fs-extra");
const server = http.createServer();

const UPLOAD_DIR = path.resolve(__dirname, "..", "target"); //大文件存储目录

const resolvePost = (req) =>
  new Promise((resolve) => {
    let chunk = "";
    req.on("data", (data) => {
      chunk += data;
    });
    req.on("end", (data) => {
      resolve(JSON.parse(chunk));
    });
  });

const pipeStream = (path, writeStream) =>
  new Promise((resolve) => {
    const readSteam = fse.createReadStream(path);
    readSteam.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    readSteam.pipe(writeStream);
  });

// 合并切片
const mergeChunk = async (filePath, filename, size) => {
  const chunkDir = path.resolve(UPLOAD_DIR, filename);
  const chunkPaths = await fse.readdirSync(chunkDir);
  // 根据下标进行排序
  // 直接读取目录的顺序会错乱
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        // 指定位置创建读写流
        fse.createWriteStream(filePath, {
          start: index * size,
          end: (index + 1) * size,
        })
      )
    )
  );
  fse.rmdirSync(chunkDir);
};
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

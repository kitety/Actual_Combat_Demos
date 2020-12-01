const path = require("path");
const mime = require("mime");
const express = require("express");
const webpack = require("webpack");
const config = require("./webpack.config.js");
const MemoryFileSystem = require("memory-fs");

// compiler代表整个webpack监听任务 全局只有一个
// 1.创建webpack-dev-server服务器
// 2.创建webpack实例
const compiler = webpack(config);
class Server {
  constructor(compiler) {
    // 保存webpack实例
    this.compiler = compiler;
    // socket的数组
    let sockets = [];
    // 绑定 监听 编译完成会触发
    let lastHash;
    // 4.添加done事件
    /**每次编译都会产生一个新的hash 另外，热更新的话，还会产生两个补丁，里面描述了从上一次结果到这一次结果都有哪些chunk和模块发生了变化  */
    compiler.hooks.done.tap("webpack-dev-server", (stats) => {
      // 每次编译会得到不同的hash
      lastHash = stats.hash;
      // 每次编译都要发送消息
      sockets.forEach((socket) => {
        // 发送最新的hash
        socket.emit("hash", lastHash);
        // 再发送ok
        socket.emit("ok");
      });
    });
    // 5.express 创建app
    const app = express();
    // 设置文件系统为内存文件系统
    let fs = new MemoryFileSystem();
    compiler.outputFileSystem = fs;
    // 监控模式启动webpack编译
    compiler.watch({}, (err) => {
      console.log("编译完成");
    });
    // dev-middleware中间件
    function middleware(req, res, next) {
      //  /index.html--index.html dist/index.html
      if (req.url === "/favicon.ico") {
        return res.sendStatus(404);
      }
      let filename = path.join(config.output.path, req.url.slice(1));
      try {
        // 用虚拟内存读取
        let stat = fs.statSync(filename);
        // 是否存在这个文件 有就直接读出来 返回
        if (stat.isFile()) {
          let content = fs.readFileSync(filename);
          let contentType = mime.getType(filename);
          res.setHeader("Content-Type", contentType);
          res.statusCode = res.statusCode || 200;
          res.send(content);
        } else {
          next();
        }
      } catch (error) {
        next();
      }
    }
    app.use(middleware);
    // 创建服务 express 就是一个请求请求监听函数
    this.server = require("http").createServer(app);
    // 引入socketio
    let io = require("socket.io")(this.server);
    // 启动一个服务器 等待连接到来
    io.on("connection", (socket) => {
      // 建立连接都放入发到sockets数组中
      sockets.push(socket);
      if (lastHash) {
        socket.emit("hash", lastHash);
        socket.emit("ok");
      }
    });
  }
  listen(port) {
    this.server.listen(port, () => {
      console.log(`服务已经启动：${port}`);
    });
  }
}
// new 一个server
// 3.创建server服务
let server = new Server(compiler);
server.listen(8001);

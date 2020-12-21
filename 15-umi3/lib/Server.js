let express = require("express");
let http = require("http");
let webpack = require("webpack");
let path = require("path");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("./webpack.config");
let { absTmpPath, absSrcPath } = require("./getPaths");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 写一个webpack中间件 打包并且预览我们的项目
class Server {
  constructor() {
    this.app = express();
  }
  setupDevMiddleware() {
    // 重写 entry alias
    webpackConfig.entry = path.join(absTmpPath, "umi.js");
    webpackConfig.resolve.alias["@"] = absSrcPath;
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: path.join(absSrcPath, "public/index.html"),
      })
    );

    let compiler = webpack(webpackConfig);
    let devMiddleware = webpackDevMiddleware(compiler, {
      writeToDisk: false,// 默认是在内存 可以设置在硬盘
    });
    this.app.use(devMiddleware);
    // 路由兼容 hash没问题 browser有问题
    this.app.use((req, res, next) => {
      // dist main.js
      // dist/index.html
      res.set("content-type", "text/html");
      res.send(
        compiler.outputFileSystem.readFileSync(
          path.join(__dirname, "dist/index.html"),
          "utf8"
        )
      );
    });
    return devMiddleware;
  }
  async start() {
    const devMiddleware = this.setupDevMiddleware();
    /* 打包完成触发 */
    devMiddleware.waitUntilValid(() => {
      let listeningApp = http.createServer(this.app);
      listeningApp.listen(8000, () => {
        console.log("服务已经启动起来了--8000");
      });
    });
  }
}
module.exports = Server;

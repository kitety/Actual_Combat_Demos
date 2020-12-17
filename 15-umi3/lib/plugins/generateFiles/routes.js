let { readFileSync } = require("fs");
let { join } = require("path");
let writeTmpFile = require("../../writeTmpFile");
let mustache = require("mustache");
let routes=require("../../getRoutes")

/**
 * 写入临时文件
 */
const plugin = (pluginApi) => {
  // 监听一个事件 生成文件了
  pluginApi.onGenerateFiles(async () => {
    console.log("开始写routes文件");
    const routesTpl = readFileSync(join(__dirname, "routes.tpl"), "utf8");
    let content = mustache.render(routesTpl, {
      routes: JSON.stringify(routes),
    });
    writeTmpFile({ path: "core/routes.js", content });
  });
};
module.exports = plugin;

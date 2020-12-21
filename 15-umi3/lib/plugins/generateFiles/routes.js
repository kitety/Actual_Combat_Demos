let { readFileSync } = require("fs");
let { join } = require("path");
let writeTmpFile = require("../../writeTmpFile");
let mustache = require("mustache");
let routes = require("../../getRoutes");
console.log("routes: ", routes);

/**
 * 写入临时文件
 */
const plugin = (pluginApi) => {
  // 监听一个事件 生成文件了
  pluginApi.onGenerateFiles(async () => {
    console.log("开始写routes文件");
    const routesTpl = readFileSync(join(__dirname, "routes.tpl"), "utf8");
    let content = mustache.render(routesTpl, {
      routes: JSON.stringify(routes, replacer, 2).replace(
        /\"component\": (\"(.+?)\")/g,
        (global, m1, m2) => {
          return `"component":${m2.replace(/\^/g, "")}`;
        }
      ),
    });
    writeTmpFile({ path: "core/routes.js", content });
  });
};
function replacer(key, value) {
  switch (key) {
    case "component":
      return `require('${value}').default`;
    default:
      return value;
  }
}
module.exports = plugin;

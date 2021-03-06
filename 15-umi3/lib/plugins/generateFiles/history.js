let { readFileSync } = require("fs");
let { join } = require("path");
let writeTmpFile = require("../../writeTmpFile");
let mustache = require("mustache");
/**
 * 写入临时文件
 */
const plugin = (pluginApi) => {
  // 监听一个事件 生成文件了
  pluginApi.onGenerateFiles(async () => {
    console.log("开始写history文件");
    const historyTpl = readFileSync(join(__dirname, "history.tpl"), "utf8");
    let content = mustache.render(historyTpl);
    writeTmpFile({ path: "core/history.js", content });
  });
};
module.exports = plugin;

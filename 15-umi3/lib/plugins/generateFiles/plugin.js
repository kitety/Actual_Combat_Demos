let { readFileSync, existsSync } = require("fs");
let { join } = require("path");
let writeTmpFile = require("../../writeTmpFile");
let mustache = require("mustache");
let { absSrcPath } = require("../../getPaths");
let { winPath } = require("../../utils");

/**
 * 写入plugin文件
 */
const plugin = (pluginApi) => {
  let plugins = [];
  if (existsSync(join(absSrcPath, "app.js"))) {
    plugins.push(join(absSrcPath, "app.js"));
  }
  // 监听一个事件 生成文件了
  pluginApi.onGenerateFiles(async () => {
    console.log("开始写plugin文件");
    const pluginTpl = readFileSync(join(__dirname, "plugin.tpl"), "utf8");
    let content = mustache.render(pluginTpl, {
      plugins: plugins.map((plugin, index) => {
        return { index, path: winPath(plugin) };
      }),
    });
    writeTmpFile({ path: "core/plugin.js", content });
  });
};
module.exports = plugin;

let Service = require("./Service");

let pluginDev = require("./plugins/commands/dev");
(async function () {
  let service = new Service({ plugins: [{ id: "dev", apply: pluginDev }] });
  // 运行dev这个命令
  await service.run({ name: "dev" });
})();
/**
 * 插件格式定义
 * {id:'dev',apply:插件对应的函数}
 */
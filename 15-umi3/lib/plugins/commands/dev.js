let Server = require("../../Server");

// 插件是个函数 会接受一个参数plugin pluginApi
const dev = (pluginApi) => {
  // 注册命令
  pluginApi.registerCommand({
    name: "dev",
    description: "启动服务",
    fn: async function () {
      console.log("启动", "dev");
      await pluginApi.service.applyPlugins({ key: "onGenerateFiles" });
      new Server().start();
    },
  });
};
module.exports = dev;

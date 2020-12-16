// 插件是个函数 会接受一个参数plugin api
const dev = (api) => {
  // 注册命令
  api.registerCommand({
    name: "dev",
    description: "启动服务",
    fn: async function () {
      console.log("启动", "dev");
    },
  });
};
module.exports = dev;

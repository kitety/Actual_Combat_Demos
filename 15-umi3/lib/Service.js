let PluginApi = require("./PluginApi");
/**
 * service 插件核心 微内核
 * 1.命令的注册和执行
 */
class Service {
  constructor(opts) {
    // key命令名字 值 命令对象  {dev:{fn}}
    // 通过插件注册
    this.commands = {}; // 存放着所有的命令和他们的实现 // dev等等
    // 取出插件 [{ id: "dev", apply: pluginDev }]
    this.plugins = opts.plugins;
  }
  init() {
    // 初始化
    for (const plugin of this.plugins) {
      let pluginApi = new PluginApi({ id: plugin.id, service: this });
      // 传入pluginApi
      plugin.apply(pluginApi);
    }
  }
  async run(args) {
    // 挂载插件
    this.init();
    return await this.runCommand(args);
  }
  async runCommand({ name }) {
    // dev...
    const command = this.commands[name];
    // 执行命令
    return command.fn();
  }
}
module.exports = Service;
